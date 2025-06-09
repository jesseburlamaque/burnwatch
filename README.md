# burnwatch

[![React](https://img.shields.io/badge/React-18.2.0-blue)](https://reactjs.org/)
[![Leaflet](https://img.shields.io/badge/Leaflet-1.9.4-brightgreen)](https://leafletjs.com/)
[![Turf.js](https://img.shields.io/badge/Turf.js-geospatial-yellow)](https://turfjs.org/)
[![Netlify](https://img.shields.io/badge/Deployed%20on-Netlify-orange)](https://www.netlify.com/)
[![NASA FIRMS](https://img.shields.io/badge/Data%20Source-NASA%20FIRMS-red)](https://firms.modaps.eosdis.nasa.gov/)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue)](https://opensource.org/licenses/MIT)


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

#### Author
Any questions, please use the email: burlamaque.jess@gmail.com

#### Sources
FIRMS archive data - https://firms.modaps.eosdis.nasa.gov/download/
What is FIRMS - https://www.earthdata.nasa.gov/faq/firms-faq
