export const config = {
  port: process.env.PORT || 3001,
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  database: {
    url: process.env.MONGODB_URL || 'mongodb://localhost:27017/satellite-map'
  },
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379'
  },
  jwt: {
    secret: process.env.JWT_SECRET || '7d3e827f9e55c36aa04c043d92d00b5c67607b1b3afd1da4999b9752261c250f567c38272edd9f34ab9d469f1a609ecf53ac4743608d97a4371ae92e6e938c5',
    expiresIn: '7d'
  },
  wms: {
    baseUrl: process.env.WMS_BASE_URL || 'https://www.wms.nrw.de/geobasis/wms_nw_dop'
  }
};

