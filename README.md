# burnwatch

[![React](https://img.shields.io/badge/React-18.2.0-blue)](https://reactjs.org/)
[![Leaflet](https://img.shields.io/badge/Leaflet-1.9.4-brightgreen)](https://leafletjs.com/)
[![Turf.js](https://img.shields.io/badge/Turf.js-geospatial-yellow)](https://turfjs.org/)
[![Netlify](https://img.shields.io/badge/Deployed%20on-Netlify-orange)](https://www.netlify.com/)
[![NASA FIRMS](https://img.shields.io/badge/Data%20Source-NASA%20FIRMS-red)](https://firms.modaps.eosdis.nasa.gov/)
[![Lifecycle:experimental](https://img.shields.io/badge/lifecycle-experimental-orange.svg)](https://lifecycle.r-lib.org/articles/stages.html#experimental)


# 🔥 Burn Watch - FIRMS Fire Data Viewer
> This project is **experimental** and was developed for exploratory purposes only.

https://burn-watch.netlify.app

This project is an **interactive experiment** built with React and Leaflet for visualizing fire hotspots detected by **MODIS** and **VIIRS (S-NPP, NOAA-20, NOAA-21)** sensors, using data from the FIRMS (NASA) platform accessed via `API`.

The goal was to **explore the integration between `React`, `Leaflet`, and public satellite monitoring `APIs`**.

---

## Features

- Displays the most recent fire hotspots (last few days)
- Filters hotspots **within a specific geographic area (ROI)** defined by a GeoJSON file
- Custom icons for each sensor type (MODIS, VIIRS)
- Automatic zoom adjustment based on the ROI area
- Explanatory legend with the sensors used

---
## Pipeline Architecture
**API Request**
Fetches CSV data from NASA FIRMS API for each sensor: MODIS, VIIRS S-NPP, VIIRS NOAA-20, and VIIRS NOAA-21.

**CSV Parsing & Normalization**
Parses rows, assigns sensor label, and converts coordinates to numeric format. Each line becomes a JavaScript object with hotspot metadata.

**ROI Filtering**
Uses Turf.js to check which points fall within the defined GeoJSON region of interest (ROI) - `@turf/boolean-point-in-polygon`

**Mapping & Visualization**
Displays filtered fire points on a Leaflet map, using a custom icon per sensor.
- `<Marker>` component is rendered with `icon={sensorIcons[point.sensor]}`
- A `<Popup>` shows additional data (brightness, date, satellite, etc.)
- The `FitBoundsToROI` function centers the map based on the GeoJSON boundaries.

**Deployment**
Built with React and deployed via Netlify, using .env variables to protect the API key.

**Possible Future Extensions**
- Add filtering by date or intensity
- Comparison between sensors
- Temporal analysis (animation of hotspots)
- Integration with historical FIRMS data

---

## How to run locally

### 1. Clone the repository

```bash
git clone https://github.com/jesseburlamaque/burnwatch
cd burnwatch
```

### 2. Install dependencies

```bash
npm install
```

### 3. Add your FIRMS API key

Create a `.env` file at the root of the project with the following content. You can obtain your free API key at: https://firms.modaps.eosdis.nasa.gov/api/

```bash
REACT_APP_FIRMS_KEY=your_api_key_here
```

### 4. Run the project locally

```bash
npm start
```

## Deploy (Netlify)

This app can be easily hosted on Netlify.  
Make sure to add the REACT_APP_FIRMS_KEY variable in the Site Settings > Environment Variables panel.

#### Sources
- FIRMS archive data - https://firms.modaps.eosdis.nasa.gov/download/
- What is FIRMS - https://www.earthdata.nasa.gov/faq/firms-faq

---

## Status do Projeto

| Status | Categoria | Item |
|--------|-----------|------|
| Feito | Funcionalidade | Mapa Leaflet com React |
| Feito | Funcionalidade | Integracao API FIRMS (MODIS, VIIRS S-NPP, NOAA-20, NOAA-21) |
| Feito | Funcionalidade | Parse de CSV e normalizacao dos dados |
| Feito | Funcionalidade | Filtro por ROI via Turf.js |
| Feito | Funcionalidade | Icones personalizados por tipo de sensor |
| Feito | Funcionalidade | Filtro temporal (24h/48h/72h/todos) |
| Feito | Funcionalidade | Camada base (OSM, OpenTopoMap, Stadia) |
| Feito | Funcionalidade | Popup Clicável com metadados do foco |
| Feito | Funcionalidade | Legenda dos sensores |
| Feito | Funcionalidade | Deploy no Netlify |
| Pendente | Correcao | URL do Stadia Satellite incorreta (`&api_key=` em vez de `?api_key=`) |
| Pendente | Correcao | `filterByTime` trata horario como UTC — FIRMS usa hora local |
| Pendente | Correcao | Console logs de debug esquecidos no codigo de producao |
| Pendente | Correcao | Camada "Regiao de Interesse" vazia no LayersControl |
| Pendente | Correcao | Falha de um sensor derruba todos os dados |
| Pendente | Seguranca | Rotacionar chaves API (FIRMS e Stadia expostas no git) |
| Feito | Seguranca | Impedir versionamento do `.env` |
| Pendente | Teste | Testes unitarios: `isInsideROI`, `filterByTime`, parse CSV |
| Pendente | Teste | Testes de integracao: fluxo fetch → parse → filtro → mapa |
| Pendente | Teste | Smoke tests: App renderiza sem crash, loading e error states |
| Pendente | Refatoracao | Componentizar App.js (351 linhas → arquivos separados) |
| Pendente | Refatoracao | Adicionar Error Boundary |
| Pendente | Refatoracao | Adicionar PropTypes ou TypeScript |
| Pendente | Refatoracao | Acessibilidade (ARIA labels, navegacao por teclado) |
| Pendente | Melhoria | Filtro por data ou intensidade (brightness) |
| Pendente | Melhoria | Comparacao entre sensores |
| Pendente | Melhoria | Animacao temporal dos focos |
| Pendente | Melhoria | Dados historicos FIRMS |
| Pendente | Melhoria | Responsividade (media queries)
