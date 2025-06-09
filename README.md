# burnwatch

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

### Run the project locally

```bash
npm start
```

## Deploy (Netlify)

This app can be easily hosted on Netlify.  
Make sure to add the REACT_APP_FIRMS_KEY variable in the Site Settings > Environment Variables panel.