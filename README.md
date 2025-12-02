# 🗺️ Satellite Map App

**Interactive web application for visualizing satellite imagery, searching locations, and creating Areas of Interest (AOI). Built with React, Vite, and OpenLayers.**

[![React](https://img.shields.io/badge/React-18.2-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0-purple.svg)](https://vitejs.dev/)
[![OpenLayers](https://img.shields.io/badge/OpenLayers-9.0-green.svg)](https://openlayers.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3-38B2AC.svg)](https://tailwindcss.com/)

---

## 🎥 Demo Video

### **Watch Full Feature Walkthrough**

[![Watch Demo](https://img.shields.io/badge/▶️_Watch_Demo_Video-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://github.com/AkshatKardak/satellite-map-app/blob/main/updated%20recording.mp4)

**Download Demo Video:** [updated recording.mp4](https://github.com/AkshatKardak/satellite-map-app/raw/main/updated%20recording.mp4) (108 MB)

**Video Contents:**
- ✅ Map initialization with satellite imagery
- ✅ Location search with Nominatim (Berlin, Paris, Tokyo)
- ✅ Drawing tools: Point markers, Lines, Polygons
- ✅ Edit and Delete features
- ✅ Layer management with opacity controls
- ✅ Zoom controls and fullscreen mode
- ✅ Mobile responsive design showcase

---

## ✨ Features

### 🌍 **Interactive Map Viewer**
- Pan, zoom, and navigate satellite imagery powered by OpenLayers
- High-resolution WMS integration (NRW DOP service)
- Smooth animations and responsive controls

### ✏️ **AOI Drawing Tools**
- **5 drawing modes:** Select, Point, Line, Polygon, Modify
- Draw Areas of Interest directly on the map
- Edit and modify existing features
- Features persist in localStorage

### 🔍 **Location Search**
- Global geocoding powered by LocationIQ API
- Autocomplete search with confidence scores
- Smooth animated zoom to selected locations
- Address details and type classification

### 🎨 **Layer Management**
- Toggle satellite layer visibility
- Adjust layer opacity (0-100%)
- Switch between multiple WMS sources
- Modern, intuitive control panel

### 📊 **Change Detection**
- Compare satellite imagery across different dates
- Visual difference highlighting
- Useful for monitoring land use changes

### 💾 **Data Persistence**
- Features automatically saved to localStorage
- Session recovery after page reload
- Export-ready architecture

---

## 🛠️ Technology Stack

| Category | Technology | Version |
|----------|-----------|---------|
| **Frontend** | React (JavaScript) | 18.2 |
| **Build Tool** | Vite | 5.0 |
| **Map Engine** | OpenLayers | 9.0 |
| **Geocoding** | LocationIQ API | - |
| **State Management** | Zustand | 4.5 |
| **Styling** | Tailwind CSS | 3.3 |
| **Icons** | Lucide React | 0.288 |
| **Testing** | Playwright | 1.40 |
| **HTTP Client** | Axios | 1.6 |

---

## 🚀 Getting Started

### Prerequisites
```
Node.js >= 18.0
npm >= 9.0
LocationIQ API key (free tier available)
```
---

### Installation

1. **Clone the repository**
```
git clone https://github.com/AkshatKardak/satellite-map-app.git
cd satellite-map-app/frontend
```

2. **Install dependencies**
```
npm install
```

3. **Configure environment variables**

```
Create `frontend/.env` file:
VITE_LOCATIONIQ_API_KEY=your_api_key_here
```

> 🔑 **Get your free API key:** [locationiq.com](https://locationiq.com)

4. **Start development server**
```
npm run dev
```

🎉 **App running at:** `http://localhost:5173`

### Build for Production
```
npm run build
npm run preview
```

### Run Tests
Run E2E tests
```
npm run test:e2e
```

Run with browser UI
```
npm run test:e2e:headed
```

---


## 🎮 Usage Guide

### 🗺️ **Navigate the Map**
- **Pan:** Click and drag
- **Zoom:** Mouse wheel or zoom controls
- **Fullscreen:** Click fullscreen button

### 🔍 **Search for Locations**
1. Click the search bar at the top
2. Type a location (e.g., "Berlin", "New York", "Eiffel Tower")
3. Select from dropdown results
4. Map automatically zooms to location with smooth animation

### ✏️ **Draw Features**
1. Select a tool from the left toolbar:
   - 📍 **Point** - Single marker
   - ➖ **Line** - Draw paths
   - ⬡ **Polygon** - Define areas
   - ✏️ **Modify** - Edit existing features
   - 🖱️ **Select** - Default mode
2. Click on map to start drawing
3. Double-click to finish (lines/polygons)
4. Features auto-save to localStorage

### 🎨 **Manage Layers**
1. Open layer control panel (right side)
2. Toggle satellite layer visibility
3. Adjust opacity with slider
4. Switch between different WMS sources

---

## 🏗️ Architecture & Design Decisions

```
┌─────────────────────────────────────────────────────────────┐
│                     User Interface (React)                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  SearchBar   │  │ DrawingTools │  │LayerManager  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  MapView     │  │ ZoomControls │  │ChangeDetect  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│               State Management (Zustand)                      │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  mapStore: { map, view, features, layers, mode }     │   │
│  └──────────────────────────────────────────────────────┘   │
│                 ▲                           ▲                 │
│                 │                           │                 │
│         ┌───────┴────────┐         ┌───────┴────────┐       │
│         │  localStorage  │         │  sessionStorage│       │
│         └────────────────┘         └────────────────┘       │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│              Map Engine (OpenLayers 9.0)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  View        │  │  Layers      │  │ Interactions │      │
│  │  (EPSG:3857) │  │  (WMS/Vector)│  │  (Draw/Zoom) │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└───────────────────────┬─────────────────────────────────────┘
                        │
        ┌───────────────┼───────────────┐
        │               │               │
        ▼               ▼               ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│  LocationIQ  │ │   WMS NRW    │ │   OSM Tiles  │
│  Geocoding   │ │   Satellite  │ │   Basemap    │
│     API      │ │   Imagery    │ │    Service   │
└──────────────┘ └──────────────┘ └──────────────┘
```

--- 

### Component Architecture
```
satellite-map-app/
│
├── App.jsx                          # Root component
│   │
│   ├── MapView.jsx                  # Core map container
│   │   ├── OpenLayers Map Instance
│   │   ├── WMS Satellite Layer
│   │   ├── Vector Layer (AOI features)
│   │   └── Interaction Handlers
│   │
│   ├── Controls/
│   │   ├── SearchBar.jsx            # LocationIQ integration
│   │   │   ├── Debounced search
│   │   │   ├── Results dropdown
│   │   │   └── Coordinate transform
│   │   │
│   │   ├── DrawingTools.jsx         # AOI creation
│   │   │   ├── Select/Point/Line/Polygon modes
│   │   │   ├── Modify/Delete interactions
│   │   │   └── Feature persistence
│   │   │
│   │   ├── LayerManager.jsx         # Layer controls
│   │   │   ├── Visibility toggles
│   │   │   ├── Opacity sliders
│   │   │   └── Source switching
│   │   │
│   │   └── CustomZoomControls.jsx   # Zoom UI
│   │
│   └── Features/
│       └── ChangeDetection.jsx      # Temporal analysis
│
└── stores/
    └── mapStore.js                  # Zustand state
        ├── Map reference
        ├── View state (center, zoom)
        ├── Features collection
        ├── Layer configuration
        └── Drawing mode
```

---

### Data Flow Diagram
```
┌─────────────┐
│   User      │
│  Interaction│
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────────┐
│  UI Component (e.g., SearchBar)         │
│  ┌────────────────────────────────┐    │
│  │ 1. User types "Berlin"         │    │
│  │ 2. Debounce 300ms              │    │
│  │ 3. Call LocationIQ API         │    │
│  └────────────────────────────────┘    │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  External API (LocationIQ)              │
│  ┌────────────────────────────────┐    │
│  │ Returns: [{                     │    │
│  │   lat: 52.520008,               │    │
│  │   lon: 13.404954,               │    │
│  │   display_name: "Berlin..."     │    │
│  │ }]                              │    │
│  └────────────────────────────────┘    │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  SearchBar Component                    │
│  ┌────────────────────────────────┐    │
│  │ 4. Transform coordinates        │    │
│  │    fromLonLat([lon, lat])      │    │
│  │    EPSG:4326 → EPSG:3857       │    │
│  └────────────────────────────────┘    │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  Zustand Store (mapStore)               │
│  ┌────────────────────────────────┐    │
│  │ 5. setView([x, y], zoom)       │    │
│  │    Updates view state           │    │
│  └────────────────────────────────┘    │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  OpenLayers Map Instance                │
│  ┌────────────────────────────────┐    │
│  │ 6. view.animate({               │    │
│  │      center: [x, y],            │    │
│  │      zoom: 14,                  │    │
│  │      duration: 1000             │    │
│  │    })                           │    │
│  └────────────────────────────────┘    │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  Map View Updates                       │
│  ┌────────────────────────────────┐    │
│  │ 7. Smooth animation to Berlin   │    │
│  │ 8. Load WMS tiles for new area  │    │
│  └────────────────────────────────┘    │
└─────────────────────────────────────────┘

```

---
### State Management Schema
```
// Zustand Store Structure
{
  // Map instance reference
  map: OpenLayersMap | null,
  
  // View configuration
  view: {
    center: [794611, 6693224],  // EPSG:3857 coordinates
    zoom: 10,
    projection: 'EPSG:3857'
  },
  
  // Feature collection
  features: [
    {
      id: 'feature-uuid',
      type: 'Point' | 'LineString' | 'Polygon',
      geometry: {
        coordinates: [...],
        projection: 'EPSG:3857'
      },
      properties: {
        name: 'AOI 1',
        created: '2024-11-28T20:30:00Z',
        modified: '2024-11-28T20:35:00Z'
      }
    }
  ],
  
  // Layer configuration
  layers: {
    satellite: {
      visible: true,
      opacity: 1.0,
      source: 'wms-nrw-dop',
      zIndex: 0
    },
    vector: {
      visible: true,
      opacity: 1.0,
      features: [...],
      zIndex: 1
    }
  },
  
  // Drawing mode
  drawingMode: 'Select' | 'Point' | 'LineString' | 'Polygon' | 'Modify',
  
  // Actions
  setMap: (map) => void,
  setView: (center, zoom) => void,
  addFeature: (feature) => void,
  updateFeature: (id, updates) => void,
  deleteFeature: (id) => void,
  setDrawingMode: (mode) => void,
  toggleLayerVisibility: (layerId) => void,
  setLayerOpacity: (layerId, opacity) => void
}
```

### Coordinate System Flow
```
User Input (LocationIQ)          OpenLayers Map
     EPSG:4326                      EPSG:3857
  (Lat/Lon WGS84)               (Web Mercator)
         │                             │
         │  [13.404954, 52.520008]     │
         │         (Berlin)            │
         │                             │
         ▼                             │
┌────────────────────┐                │
│  fromLonLat()      │                │
│  Transformation    │                │
└────────┬───────────┘                │
         │                             │
         │  [1491333, 6893163]         │
         │   (Transformed)             │
         │                             │
         └─────────────────────────────▼
                            ┌──────────────────┐
                            │ Map View Update  │
                            │ - Center         │
                            │ - Zoom           │
                            │ - Animation      │
                            └──────────────────┘
```

---
### API Integration Schema
```
┌──────────────────────────────────────────────────────┐
│              LocationIQ Geocoding API                 │
├──────────────────────────────────────────────────────┤
│                                                       │
│  Request:                                             │
│  GET https://us1.locationiq.com/v1/search            │
│      ?key=YOUR_API_KEY                               │
│      &q=Berlin                                       │
│      &format=json                                    │
│      &limit=5                                        │
│      &addressdetails=1                               │
│                                                       │
│  Response:                                            │
│  [                                                    │
│    {                                                  │
│      "place_id": "332397940094",                     │
│      "lat": "52.5200066",                            │
│      "lon": "13.404954",                             │
│      "display_name": "Berlin, Germany",              │
│      "type": "city",                                 │
│      "importance": 0.96,                             │
│      "address": {                                    │
│        "city": "Berlin",                             │
│        "country": "Germany"                          │
│      }                                                │
│    }                                                  │
│  ]                                                    │
│                                                       │
└──────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────┐
│              WMS Satellite Imagery                    │
├──────────────────────────────────────────────────────┤
│                                                       │
│  Request:                                             │
│  GET https://www.wms.nrw.de/geobasis/wms_nw_dop      │
│      ?SERVICE=WMS                                    │
│      &VERSION=1.3.0                                  │
│      &REQUEST=GetMap                                 │
│      &LAYERS=nw_dop_rgb                              │
│      &STYLES=                                        │
│      &CRS=EPSG:3857                                  │
│      &BBOX=minx,miny,maxx,maxy                       │
│      &WIDTH=256                                      │
│      &HEIGHT=256                                     │
│      &FORMAT=image/png                               │
│                                                       │
│  Response:                                            │
│  [PNG image data - 256x256 tile]                     │
│                                                       │
└──────────────────────────────────────────────────────┘
```
---
### Performance Optimization Strategy
```
Current (500 features)          Future (10,000+ features)
        │                                 │
        ▼                                 ▼
┌─────────────────┐           ┌─────────────────────┐
│  Vector Layer   │           │  Clustered Layer    │
│  - All features │           │  - Cluster source   │
│  - Direct render│           │  - Dynamic sizing   │
└─────────────────┘           └─────────────────────┘
        │                                 │
        │                                 │
        ▼                                 ▼
┌─────────────────┐           ┌─────────────────────┐
│  Canvas Render  │           │  WebGL Render       │
│  - 2D context   │           │  - GPU acceleration │
│  - CPU bound    │           │  - 10x faster       │
└─────────────────┘           └─────────────────────┘
        │                                 │
        │                                 │
        ▼                                 ▼
┌─────────────────┐           ┌─────────────────────┐
│  Feature List   │           │  Virtual Scroll     │
│  - Full render  │           │  - Render visible   │
│  - 500 items    │           │  - Constant memory  │
└─────────────────┘           └─────────────────────┘

```

---
### Database Schema (Future Enhancement)
```
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Projects table
CREATE TABLE projects (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Features table (PostGIS extension)
CREATE TABLE features (
  id UUID PRIMARY KEY,
  project_id UUID REFERENCES projects(id),
  feature_type VARCHAR(50),
  geometry GEOMETRY(Geometry, 3857),
  properties JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Spatial index
CREATE INDEX idx_features_geometry 
  ON features USING GIST(geometry);

-- GIN index for JSONB properties
CREATE INDEX idx_features_properties 
  ON features USING GIN(properties);
```

---

### **Why OpenLayers over Leaflet/MapLibre?**
✅ **Advanced WMS support** - Essential for satellite imagery layers  
✅ **Robust vector drawing API** - Perfect for AOI workflows  
✅ **Performance** - Handles thousands of features efficiently  
✅ **Mature ecosystem** - Extensive documentation and plugins  

**Alternatives considered:**
- ❌ Leaflet - Simpler but limited WMS and vector capabilities
- ❌ MapLibre - Modern but newer, less mature plugin ecosystem

### **Why Zustand for State Management?**
✅ **Minimal boilerplate** - Less code than Redux  
✅ **JavaScript-friendly** - Works seamlessly with React  
✅ **Built-in persistence** - localStorage middleware included  
✅ **Performance** - No Context API re-render issues  

### **Coordinate System Handling**
Uses **EPSG:3857** (Web Mercator) for map display with `ol/proj.fromLonLat()` to transform LocationIQ results from **EPSG:4326** (WGS84 lat/lon).

---

## 📈 Performance Considerations

### **Current Optimizations**
- ⚡ **Debounced search** (300ms) reduces LocationIQ API calls
- 🎨 **Lazy component loading** improves initial bundle size
- 🔄 **React.memo** prevents unnecessary re-renders
- 💾 **localStorage caching** reduces redundant operations

### **Scaling to 1000s of Features**

| Challenge | Solution | Expected Improvement |
|-----------|----------|---------------------|
| Dense point clusters | **ol/source/Cluster** | 90% render time reduction |
| Large feature lists | **react-window** virtual scrolling | Constant memory usage |
| Slow vector rendering | **WebGL layers** (ol/layer/WebGLPoints) | 10x faster rendering |
| Big datasets | **Backend pagination + filtering** | Only load visible features |
| Spatial queries | **R-tree indexing** | Sub-millisecond lookups |

**Performance Benchmarks:**
- ✅ Current: Smooth with **500 features**
- 🎯 With clustering: Smooth with **10,000+ features**
- 🚀 With WebGL: Smooth with **100,000+ points**

---

## 🧪 Testing Strategy

### **Current Test Coverage**
✅ Map initialization and OpenLayers instance creation  
✅ LocationIQ geocoding search functionality  
✅ Drawing tool feature creation workflow  
✅ Layer visibility and opacity controls  

### **Playwright E2E Tests**
```
test('User can search and navigate to Berlin', async ({ page }) => {
await page.goto('http://localhost:5173');
await page.fill('[data-testid="search-input"]', 'Berlin');
await page.click('text=Berlin, Germany');
// Assert map center changed to Berlin coordinates
});
```


### **With More Time Would Add:**
- ✅ Unit tests for utilities and hooks (Vitest)
- ✅ Component tests (React Testing Library)
- ✅ Visual regression tests (Percy/Chromatic)
- ✅ API mocking (MSW - Mock Service Worker)
- ✅ Accessibility tests (axe-core/jest-axe)
- ✅ Performance benchmarks (Lighthouse CI)

---

## ⚖️ Tradeoffs & Decisions

| Decision | Rationale | Tradeoff |
|----------|-----------|----------|
| **Client-side only** | Faster development, no hosting costs | Limited to browser storage, no multi-device sync |
| **Direct LocationIQ API** | Simpler architecture, fewer moving parts | API key visible in network requests (mitigated by rate limits) |
| **Manual coordinate transforms** | Full control, educational value | More verbose than using helper library |
| **Tailwind utility classes** | Rapid styling, consistent design system | Longer className strings in JSX |
| **No authentication** | Out of scope for MVP | Features not shareable between users |
| **localStorage only** | Simple persistence, no backend needed | Data lost if localStorage cleared |

---

## 🚀 Production Readiness Checklist

To make this production-ready, I would add:

### **Security & Backend**
- [ ] Backend API (Node.js/Express) for secure API key management
- [ ] Authentication (JWT/OAuth2) for user accounts
- [ ] Rate limiting middleware to prevent API abuse
- [ ] HTTPS enforcement and CORS configuration

### **Infrastructure**
- [ ] Database (PostgreSQL + PostGIS) for spatial data
- [ ] CDN (Cloudflare/AWS CloudFront) for asset delivery
- [ ] Docker containerization for consistent deployments
- [ ] CI/CD pipeline (GitHub Actions) for automated testing & deployment
- [ ] Environment-specific configs (dev/staging/prod)

### **Monitoring & Observability**
- [ ] Error boundaries (React) with fallback UI
- [ ] Error tracking (Sentry) with source maps
- [ ] Analytics (Plausible/Google Analytics 4) for usage insights
- [ ] Performance monitoring (DataDog/New Relic)
- [ ] Uptime monitoring (UptimeRobot/Pingdom)

### **Features**
- [ ] Offline support (PWA with Service Worker)
- [ ] Feature export (GeoJSON, KML, Shapefile formats)
- [ ] Undo/Redo for drawing operations
- [ ] Collaborative editing with WebSockets
- [ ] Mobile touch gesture optimization
- [ ] Multi-language support (i18n)

---

## ⏱️ Development Time Breakdown

**Total Time: ~15 hours**

| Phase | Hours | Details |
|-------|-------|---------|
| **Research & Planning** | 2h | Map library evaluation, architecture design, Figma review |
| **Core Map Implementation** | 4h | OpenLayers integration, WMS layer setup, coordinate systems |
| **UI Components** | 3h | Drawing tools, search bar, layer manager, custom controls |
| **State Management** | 1.5h | Zustand store setup, persistence middleware, feature management |
| **Styling & Responsiveness** | 2h | Tailwind configuration, component styling, mobile layout |
| **Testing & Debugging** | 1.5h | Playwright test suite, bug fixes, browser compatibility |
| **Documentation** | 1h | README writing, code comments, video recording |

---

## 🐛 Known Issues & Future Enhancements

### **Current Limitations**
- ⚠️ No undo/redo for drawing operations
- ⚠️ Features lost if localStorage is cleared
- ⚠️ Limited mobile touch gesture support
- ⚠️ Search results capped at 5 items
- ⚠️ No collaborative editing features

### **Planned Improvements**
- [ ] **PWA support** - Offline map tile caching with Service Worker
- [ ] **Multi-language** - i18n support (English, German, French)
- [ ] **Keyboard shortcuts** - Power user features (e.g., Ctrl+Z for undo)
- [ ] **Feature export** - Download as GeoJSON, KML, or Shapefile
- [ ] **Real-time collaboration** - Multiple users editing simultaneously via WebSockets
- [ ] **Mobile app** - React Native version for iOS/Android
- [ ] **Advanced measurements** - Distance, area, perimeter calculations
- [ ] **Print/PDF export** - Generate printable maps with annotations

---

## 📚 Additional Resources

### **Documentation**
- [OpenLayers API Reference](https://openlayers.org/en/latest/apidoc/)
- [LocationIQ API Docs](https://locationiq.com/docs)
- [Zustand Documentation](https://docs.pmnd.rs/zustand)
- [Figma Design Prototype](https://www.figma.com/proto/mtvRfVu94PTKLaOkbPmqOX/)

### **Related Technologies**
- [WMS NRW DOP Service](https://www.wms.nrw.de/geobasis/wms_nw_dop)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Playwright Testing](https://playwright.dev/)

---

## 📄 License

This project is part of an internship assignment for **Flowbit Private Limited**.

---

## 👤 Author

**Akshat Kardak**  
Computer Engineering Student | Full-Stack Developer

[![GitHub](https://img.shields.io/badge/GitHub-AkshatKardak-181717?style=flat&logo=github)](https://github.com/AkshatKardak)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=flat&logo=linkedin)](https://linkedin.com/in/akshatkardak)

---

## 🙏 Acknowledgments

- **OpenLayers Team** - For the powerful mapping library
- **LocationIQ** - Free geocoding API for location search
- **Flowbit Private Limited** - For this exciting internship opportunity
- **React & Vite Communities** - Excellent documentation and tools

---

<div align="center">

### **Built with ❤️ using React, Vite, and OpenLayers**

⭐ **Star this repo if you found it helpful!**

</div>

---

## 🔗 Quick Links

| Resource | Link |
|----------|------|
| 📹 **Demo Video** |[![Watch Demo](https://img.shields.io/badge/▶️_Watch_Demo_Video-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://github.com/AkshatKardak/satellite-map-app/blob/main/updated%20recording.mp4)
| 🚀 **GitHub Release** | [View v1.0.0](https://github.com/AkshatKardak/satellite-map-app/releases/tag/v1.0.0) |
| 🔍 **Figma Design** | [View Prototype](https://www.figma.com/proto/mtvRfVu94PTKLaOkbPmqOX/) |
| 🐛 **Report Bug** | [Open Issue](https://github.com/AkshatKardak/satellite-map-app/issues) |
| 💡 **Request Feature** | [Submit Idea](https://github.com/AkshatKardak/satellite-map-app/issues/new) |
| 🌐 **LocationIQ** | [Get API Key](https://locationiq.com) |

---

**Made for the Flowbit Private Limited Internship Challenge** 🚀
