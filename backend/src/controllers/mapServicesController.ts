import { Request, Response } from 'express';

export const getAvailableServices = async (req: Request, res: Response) => {
  const services = {
    wms: [
      {
        name: 'NRW Germany DOP',
        url: 'https://www.wms.nrw.de/geobasis/wms_nw_dop',
        layers: 'nw_dop',
        format: 'image/png',
        maxZoom: 19,
        attribution: '© NRW Germany',
        free: true,
        available: true
      },
      {
        name: 'NASA Global Mosaic',
        url: 'https://tiles.maps.eox.at/wms',
        layers: 's2cloudless-2021_3857',
        format: 'image/jpeg',
        maxZoom: 14,
        attribution: '© NASA',
        free: true,
        available: true
      }
    ],
    tiles: [
      {
        name: 'OpenStreetMap Standard',
        url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors',
        free: true
      }
    ]
  };

  res.json({
    success: true,
    data: services
  });
};

export const getWMSServices = async (req: Request, res: Response) => {
  const services = [
    {
      name: 'NRW Germany DOP',
      url: 'https://www.wms.nrw.de/geobasis/wms_nw_dop',
      layers: 'nw_dop',
      format: 'image/png',
      maxZoom: 19,
      attribution: '© NRW Germany',
      free: true,
      available: true
    },
    {
      name: 'NASA Global Mosaic',
      url: 'https://tiles.maps.eox.at/wms',
      layers: 's2cloudless-2021_3857',
      format: 'image/jpeg',
      maxZoom: 14,
      attribution: '© NASA',
      free: true,
      available: true
    },
    {
      name: 'USGS Satellite',
      url: 'https://basemap.nationalmap.gov/arcgis/services/USGSImageryOnly/MapServer/WMSServer',
      layers: '0',
      format: 'image/jpeg',
      maxZoom: 15,
      attribution: '© USGS',
      free: true,
      available: true
    }
  ];

  res.json({
    success: true,
    data: services
  });
};

export const getTileServices = async (req: Request, res: Response) => {
  const services = [
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
    }
  ];

  res.json({
    success: true,
    data: services
  });
};