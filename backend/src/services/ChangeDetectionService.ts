import sharp from 'sharp';
import axios from 'axios';
import { Redis } from 'ioredis';
import { config } from '../config/environment.js';

export interface ChangeDetectionResult {
  changePercentage: number;
  changedAreas: Array<{
    bounds: [number, number, number, number];
    confidence: number;
  }>;
  beforeImage: string;
  afterImage: string;
  differenceImage: string;
  timestamp: Date;
}

export class ChangeDetectionService {
  private redis: Redis;

  constructor() {
    this.redis = new Redis(config.redis.url);
  }

  async detectChanges(
    bounds: [number, number, number, number],
    beforeDate: string,
    afterDate: string
  ): Promise<ChangeDetectionResult> {
    const cacheKey = `change:${bounds.join(',')}:${beforeDate}:${afterDate}`;
    
    // Check cache first
    const cached = await this.redis.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    // Fetch imagery from different dates
    const [beforeImage, afterImage] = await Promise.all([
      this.fetchSatelliteImagery(bounds, beforeDate),
      this.fetchSatelliteImagery(bounds, afterDate)
    ]);

    // Perform change detection analysis
    const analysis = await this.analyzeChanges(beforeImage, afterImage);

    const result: ChangeDetectionResult = {
      changePercentage: analysis.changePercentage,
      changedAreas: analysis.changedAreas,
      beforeImage: beforeImage.toString('base64'),
      afterImage: afterImage.toString('base64'),
      differenceImage: analysis.differenceImage.toString('base64'),
      timestamp: new Date()
    };

    // Cache result for 1 hour
    await this.redis.setex(cacheKey, 3600, JSON.stringify(result));

    return result;
  }

  private async fetchSatelliteImagery(
    bounds: [number, number, number, number],
    date: string
  ): Promise<Buffer> {
    const [minX, minY, maxX, maxY] = bounds;
    
    const wmsUrl = new URL(config.wms.baseUrl);
    wmsUrl.searchParams.set('SERVICE', 'WMS');
    wmsUrl.searchParams.set('REQUEST', 'GetMap');
    wmsUrl.searchParams.set('VERSION', '1.3.0');
    wmsUrl.searchParams.set('LAYERS', 'nw_dop');
    wmsUrl.searchParams.set('STYLES', '');
    wmsUrl.searchParams.set('CRS', 'EPSG:25832');
    wmsUrl.searchParams.set('BBOX', `${minX},${minY},${maxX},${maxY}`);
    wmsUrl.searchParams.set('WIDTH', '512');
    wmsUrl.searchParams.set('HEIGHT', '512');
    wmsUrl.searchParams.set('FORMAT', 'image/png');
    wmsUrl.searchParams.set('TIME', date);

    const response = await axios.get(wmsUrl.toString(), {
      responseType: 'arraybuffer',
      timeout: 30000
    });

    return Buffer.from(response.data);
  }

  private async analyzeChanges(
    beforeImage: Buffer,
    afterImage: Buffer
  ): Promise<{
    changePercentage: number;
    changedAreas: Array<{ bounds: [number, number, number, number]; confidence: number }>;
    differenceImage: Buffer;
  }> {
    // Convert images to sharp objects
    const beforeSharp = sharp(beforeImage);
    const afterSharp = sharp(afterImage);

    // Get image metadata
    const beforeMetadata = await beforeSharp.metadata();
    const afterMetadata = await afterSharp.metadata();

    const width = beforeMetadata.width || 512;
    const height = beforeMetadata.height || 512;

    // Ensure both images have same dimensions
    const resizedBefore = beforeSharp.resize(width, height);
    const resizedAfter = afterSharp.resize(width, height);

    // Convert to grayscale for comparison
    const beforeGray: Buffer = await resizedBefore
      .grayscale()
      .raw()
      .toBuffer();

    const afterGray: Buffer = await resizedAfter
      .grayscale()
      .raw()
      .toBuffer();

    // Calculate difference - FIXED: Add bounds checking
    const differenceBuffer = Buffer.alloc(beforeGray.length);
    let changedPixels = 0;
    const threshold = 30;

    for (let i = 0; i < beforeGray.length; i++) {
      // FIX: Ensure we're accessing valid indices
      const beforePixel = beforeGray[i] ?? 0;
      const afterPixel = afterGray[i] ?? 0;
      const diff = Math.abs(beforePixel - afterPixel);
      
      differenceBuffer[i] = diff > threshold ? 255 : 0;
      if (diff > threshold) {
        changedPixels++;
      }
    }

    const changePercentage = (changedPixels / beforeGray.length) * 100;

    // Create difference image
    const differenceImage = await sharp(differenceBuffer, {
      raw: { width, height, channels: 1 }
    })
      .png()
      .toBuffer();

    // Detect changed areas
    const changedAreas = this.detectChangedAreas(differenceBuffer, width, height);

    return {
      changePercentage,
      changedAreas,
      differenceImage
    };
  }

  private detectChangedAreas(
    differenceBuffer: Buffer,
    width: number,
    height: number
  ): Array<{ bounds: [number, number, number, number]; confidence: number }> {
    const areas: Array<{ bounds: [number, number, number, number]; confidence: number }> = [];
    const visited = new Set<number>();
    const minAreaSize = 10;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const index = y * width + x;
        
        // FIX: Add bounds checking for buffer access
        if (index < differenceBuffer.length && differenceBuffer[index] === 255 && !visited.has(index)) {
          const area = this.floodFill(differenceBuffer, width, height, x, y, visited);
          
          if (area.pixels.length >= minAreaSize) {
            areas.push({
              bounds: [area.minX, area.minY, area.maxX, area.maxY],
              confidence: Math.min(area.pixels.length / 100, 1.0)
            });
          }
        }
      }
    }

    return areas;
  }

  private floodFill(
    buffer: Buffer,
    width: number,
    height: number,
    startX: number,
    startY: number,
    visited: Set<number>
  ): { pixels: number[]; minX: number; minY: number; maxX: number; maxY: number } {
    const stack: Array<[number, number]> = [[startX, startY]];
    const pixels: number[] = [];
    
    let minX: number = startX, minY: number = startY, maxX: number = startX, maxY: number = startY;

    while (stack.length > 0) {
      const [x, y] = stack.pop()!;
      const index = y * width + x;

      // FIX: Add comprehensive bounds checking
      if (x < 0 || x >= width || y < 0 || y >= height || 
          index >= buffer.length || visited.has(index) || buffer[index] !== 255) {
        continue;
      }

      visited.add(index);
      pixels.push(index);

      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);

      stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
    }

    return { pixels, minX, minY, maxX, maxY };
  }
}