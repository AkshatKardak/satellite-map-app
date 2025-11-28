import axios from 'axios';
import sharp from 'sharp';

export interface MapServiceConfig {
  name: string;
  url: string;
  layers: string;
  format: string;
  maxZoom: number;
  attribution: string;
  free: boolean;
}

export class MapService {
  private static freeWMSServices: MapServiceConfig[] = [
    {
      name: 'NRW Germany DOP',
      url: 'https://www.wms.nrw.de/geobasis/wms_nw_dop',
      layers: 'nw_dop',
      format: 'image/png',
      maxZoom: 19,
      attribution: '© NRW Germany',
      free: true
    },
    {
      name: 'NASA Global Mosaic',
      url: 'https://tiles.maps.eox.at/wms',
      layers: 's2cloudless-2021_3857',
      format: 'image/jpeg',
      maxZoom: 14,
      attribution: '© NASA',
      free: true
    },
    {
      name: 'USGS Satellite',
      url: 'https://basemap.nationalmap.gov/arcgis/services/USGSImageryOnly/MapServer/WMSServer',
      layers: '0',
      format: 'image/jpeg',
      maxZoom: 15,
      attribution: '© USGS',
      free: true
    },
    {
      name: 'ESA Sentinel-2',
      url: 'https://tiles.maps.eox.at/wms',
      layers: 's2cloudless-2021_3857',
      format: 'image/jpeg',
      maxZoom: 14,
      attribution: '© ESA',
      free: true
    }
  ];

  private static freeTileServices = [
    {
      name: 'OpenStreetMap Standard',
      url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors',
      free: true
    },
    {
      name: 'Stamen Terrain',
      url: 'https://stamen-tiles.a.ssl.fastly.net/terrain/{z}/{x}/{y}.jpg',
      maxZoom: 18,
      attribution: '© Stamen Design',
      free: true
    },
    {
      name: 'CartoDB Voyager',
      url: 'https://{a-d}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
      maxZoom: 20,
      attribution: '© CartoDB',
      free: true
    },
    {
      name: 'OpenTopoMap',
      url: 'https://{a-c}.tile.opentopomap.org/{z}/{x}/{y}.png',
      maxZoom: 17,
      attribution: '© OpenTopoMap',
      free: true
    }
  ];

  static getFreeWMSServices(): MapServiceConfig[] {
    return this.freeWMSServices;
  }

  static getFreeTileServices() {
    return this.freeTileServices;
  }

  static async getServiceHealth(service: MapServiceConfig): Promise<boolean> {
    try {
      const testParams = {
        service: 'WMS',
        request: 'GetMap',
        version: '1.3.0',
        layers: service.layers,
        styles: '',
        crs: 'EPSG:3857',
        bbox: '-2000000,-2000000,2000000,2000000',
        width: 256,
        height: 256,
        format: service.format
      };

      const response = await axios.get(service.url, {
        params: testParams,
        timeout: 10000,
        responseType: 'arraybuffer'
      });

      return response.status === 200;
    } catch (error) {
      console.log(`Service ${service.name} health check failed:`, (error as Error).message);
      return false;
    }
  }

  static async getAvailableServices(): Promise<{
    wms: MapServiceConfig[];
    tiles: any[];
  }> {
    const healthChecks = await Promise.all(
      this.freeWMSServices.map(async (service) => ({
        ...service,
        available: await this.getServiceHealth(service)
      }))
    );

    return {
      wms: healthChecks,
      tiles: this.freeTileServices
    };
  }
}