import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import roi from './roi.json';
import fireIcon from './fire.png';
import { useMap } from 'react-leaflet';

import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import { point as turfPoint } from '@turf/helpers';

// Ícone customizado
const FireIcon = new L.Icon({
  iconUrl: fireIcon,
  iconSize: [25, 25],
  iconAnchor: [12, 12],
  popupAnchor: [0, -10],
});

// Função para verificar se o ponto está dentro da ROI
const isInsideROI = (lat, lon, geojson) => {
  const pt = turfPoint([lon, lat]);
  return geojson.features.some(feature => booleanPointInPolygon(pt, feature));
};

// function FitBoundsToROI({ geojson }) {
function FitBoundsToROI({ geojson }) {
  const map = useMap();

  useEffect(() => {
    const bounds = L.geoJSON(geojson).getBounds();
    map.fitBounds(bounds, { padding: [20, 20] });
  }, [geojson, map]);

  return null;
}

function App() {
  const [fireData, setFireData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllSensors = async () => {
      const mapKey = process.env.REACT_APP_FIRMS_KEY; 

      const sensors = [
        { name: 'MODIS_NRT', label: 'MODIS' },
        { name: 'VIIRS_SNPP_NRT', label: 'VIIRS S-NPP' },
        { name: 'VIIRS_NOAA20_NRT', label: 'VIIRS NOAA-20' },
        { name: 'VIIRS_NOAA21_NRT', label: 'VIIRS NOAA-21' },
      ];

      try {
        const allData = await Promise.all(
          sensors.map(async (sensor) => {
            const url = `https://firms.modaps.eosdis.nasa.gov/api/area/csv/${mapKey}/${sensor.name}/world/2`;
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Error from ${sensor.label}`);
            const text = await response.text();
            const rows = text.trim().split('\n').map(r => r.split(','));
            const headers = rows[0];
            return rows.slice(1).map(row => {
  const obj = {};
  headers.forEach((h, i) => obj[h] = row[i]);
  obj.sensor = sensor.label;

  // 👇 Aqui, dentro do sensor
  if (!obj.sensor) {
    console.warn(`[${sensor.label}] sensor not set:`, obj);
  }

  return obj;
            });
          })
        );

        // Junta tudo e filtra os pontos dentro da ROI
        const merged = allData.flat().filter(d => {
          const lat = parseFloat(d.latitude);
          const lon = parseFloat(d.longitude);
          return lat && lon && isInsideROI(lat, lon, roi);
        });

        // Logs de validação
console.log("Total points fetched from all sensors:", allData.flat().length);
console.log("Points inside ROI after filtering:", merged.length);

        setFireData(merged);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllSensors();
  }, []);

  if (loading) return <div>🔥 Loading fire data...</div>;
  if (error) return (
  <div style={{ padding: '1rem', color: 'red' }}>
    🚨 Ocorreu um erro ao carregar os focos de calor.<br />
    Detalhes: {error.message}<br />
    Verifique sua conexão ou a chave da API FIRMS.
  </div>
);

  return (
    <div>
      <h2>  Burn Watch - FIRMS Fire Data Viewer</h2>
      <MapContainer center={[0, 0]} zoom={3} style={{ height: '85vh', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="© OpenStreetMap contributors"
        />
        <GeoJSON
  data={roi}
  style={{
    color: 'black',           // cor da linha
    weight: 2,              // espessura
    fillOpacity: 0,         // sem preenchimento
    dashArray: '4 4'        // linha tracejada (4px traço, 4px espaço)
  }}
/> <FitBoundsToROI geojson={roi} />

        {fireData.map((point, i) => (
          <Marker
            key={i}
            position={[+point.latitude, +point.longitude]}
            icon={FireIcon}
          >
            <Popup>
              <strong>{point.sensor}</strong><br />
              Brightness: {point.brightness}<br />
              Date: {point.acq_date}<br />
              Satellite: {point.satellite}
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Legenda */}
      <div style={{ padding: '10px' }}>
        <h4>Legenda:</h4>
        <ul>
          <li><img src={fireIcon} alt="icon" width={16} /> MODIS</li>
          <li><img src={fireIcon} alt="icon" width={16} /> VIIRS S-NPP</li>
          <li><img src={fireIcon} alt="icon" width={16} /> VIIRS NOAA-20</li>
          <li><img src={fireIcon} alt="icon" width={16} /> VIIRS NOAA-21</li>
        </ul>
      </div>
    </div>
  );
}

export default App;
