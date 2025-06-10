import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import roi from './roi.json';

import modisIcon from './modis.png';
import snppIcon from './viirs_snpp.png';
import noaa20Icon from './viirs_noaa20.png';
import noaa21Icon from './viirs_noaa21.png';

import { useMap } from 'react-leaflet';

import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import { point as turfPoint } from '@turf/helpers';

import { LayersControl, LayerGroup } from 'react-leaflet';
const { BaseLayer, Overlay } = LayersControl;

// Ícone customizado
const sensorIcons = {
  'MODIS': new L.Icon({ iconUrl: modisIcon, iconSize: [25, 25], iconAnchor: [12, 12], popupAnchor: [0, -10] }),
  'VIIRS S-NPP': new L.Icon({ iconUrl: snppIcon, iconSize: [25, 25], iconAnchor: [12, 12], popupAnchor: [0, -10] }),
  'VIIRS NOAA-20': new L.Icon({ iconUrl: noaa20Icon, iconSize: [25, 25], iconAnchor: [12, 12], popupAnchor: [0, -10] }),
  'VIIRS NOAA-21': new L.Icon({ iconUrl: noaa21Icon, iconSize: [25, 25], iconAnchor: [12, 12], popupAnchor: [0, -10] }),
};

const fallbackIcon = new L.Icon.Default();

// Ícone padrão
const DefaultIcon = new L.Icon({
  iconUrl: modisIcon, // ou qualquer um dos outros como fallback
  iconSize: [25, 25],
  iconAnchor: [12, 12],
  popupAnchor: [0, -10],
});

// Função para verificar se o ponto está dentro da ROI
const isInsideROI = (lat, lon, geojson) => {
  const pt = turfPoint([lon, lat]);
  return geojson.features.some(feature => booleanPointInPolygon(pt, feature));
};

// Função para filtrar por tempo
const filterByTime = (data, filter) => {
  if (filter === 'all') return data;
  
  const now = new Date();
  const hoursMap = {
    '24h': 24,
    '48h': 48,
    '72h': 72
  };
  
  const hoursToSubtract = hoursMap[filter];
  if (!hoursToSubtract) return data;
  
  const cutoffTime = new Date(now.getTime() - (hoursToSubtract * 60 * 60 * 1000));
  
  return data.filter(point => {
    // Formato da data do FIRMS: YYYY-MM-DD
    // Formato do tempo do FIRMS: HHMM
    const dateStr = point.acq_date;
    const timeStr = point.acq_time;
    
    if (!dateStr || !timeStr) return true;
    
    // Converte HHMM para HH:MM
    const formattedTime = timeStr.length === 4 ? 
      `${timeStr.slice(0, 2)}:${timeStr.slice(2, 4)}` : 
      timeStr;
    
    const pointDateTime = new Date(`${dateStr}T${formattedTime}:00Z`);
    return pointDateTime >= cutoffTime;
  });
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

// Componente para renderizar os marcadores de um sensor específico
function SensorMarkers({ data, sensorName, timeFilter }) {
  const sensorData = data.filter(point => point.sensor === sensorName);
  const filteredData = filterByTime(sensorData, timeFilter);
  
  return (
    <LayerGroup>
      {filteredData.map((point, i) => (
        <Marker
          key={`${sensorName}-${i}`}
          position={[+point.latitude, +point.longitude]}
          icon={sensorIcons[point.sensor] || fallbackIcon}
        >
          <Popup>
            <strong>{point.sensor}</strong><br />
            Brightness: {point.brightness}<br />
            Date: {point.acq_date}<br />
            Time: {point.acq_time}<br />
            Satellite: {point.satellite}
          </Popup>
        </Marker>
      ))}
    </LayerGroup>
  );
}

function App() {
  const [fireData, setFireData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeFilter, setTimeFilter] = useState('all'); // 'all', '24h', '48h', '72h'
  const sensorTypes = ['MODIS', 'VIIRS S-NPP', 'VIIRS NOAA-20', 'VIIRS NOAA-21']; // Lista de sensores únicos para criar os layers

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
            const url = `https://firms.modaps.eosdis.nasa.gov/api/area/csv/${mapKey}/${sensor.name}/world/7`;
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

const stadiaKey = process.env.REACT_APP_STADIA_API_KEY;

  return (
    <div>
      <h2>  Burn Watch - FIRMS Fire Data Viewer</h2>
      
      {/* Controles de Filtro de Tempo */}
      <div style={{
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        padding: '15px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        margin: '10px 0',
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        flexWrap: 'wrap'
      }}>
        <span style={{ fontWeight: 'bold', color: '#333' }}>🕒 Filtrar por tempo:</span>
        
        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
          <input
            type="radio"
            name="timeFilter"
            value="all"
            checked={timeFilter === 'all'}
            onChange={(e) => setTimeFilter(e.target.value)}
            style={{ marginRight: '5px' }}
          />
          Todos os focos
        </label>
        
        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
          <input
            type="radio"
            name="timeFilter"
            value="24h"
            checked={timeFilter === '24h'}
            onChange={(e) => setTimeFilter(e.target.value)}
            style={{ marginRight: '5px' }}
          />
          Últimas 24h
        </label>
        
        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
          <input
            type="radio"
            name="timeFilter"
            value="48h"
            checked={timeFilter === '48h'}
            onChange={(e) => setTimeFilter(e.target.value)}
            style={{ marginRight: '5px' }}
          />
          Últimas 48h
        </label>
        
        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
          <input
            type="radio"
            name="timeFilter"
            value="72h"
            checked={timeFilter === '72h'}
            onChange={(e) => setTimeFilter(e.target.value)}
            style={{ marginRight: '5px' }}
          />
          Últimas 72h
        </label>
      </div>

      <MapContainer center={[0, 0]} zoom={3} style={{ height: '85vh', width: '100%' }}>
  <LayersControl position="topright">
  {/* Base Layers */}
  <BaseLayer checked name="OpenStreetMap">
    <TileLayer
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      attribution="© OpenStreetMap contributors"
    />
  </BaseLayer>

  <BaseLayer name="OpenTopoMap">
    <TileLayer
      url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
      attribution="© OpenStreetMap contributors"
    />
  </BaseLayer>

  <BaseLayer name="Stadia Satellite">
    <TileLayer
      url={`https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}&api_key=${stadiaKey}`}
      attribution="&copy; <a href='https://stadiamaps.com/'>Stadia Maps</a>, &copy; Satellite Imagery"
    />
  </BaseLayer>

  {/* Sensor Overlay Layers */}
  {sensorTypes.map(sensorType => (
    <Overlay key={sensorType} checked name={`🔥 ${sensorType}`}>
      <SensorMarkers data={fireData} sensorName={sensorType} timeFilter={timeFilter} />
    </Overlay>
  ))}

  {/* ROI Overlay */}
  <Overlay checked name="🗺️ Região de Interesse">
    
  </Overlay>
</LayersControl>
        <GeoJSON
  data={roi}
  style={{
    color: 'black',           // cor da linha
    weight: 2,              // espessura
    fillOpacity: 0,         // sem preenchimento
    dashArray: '4 4'        // linha tracejada (4px traço, 4px espaço)
  }}
/> <FitBoundsToROI geojson={roi} />
        
      </MapContainer>

      {/* Legenda */}
      <div style={{
  position: 'absolute',
  bottom: '120px',
  right: '20px',
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  padding: '10px',
  borderRadius: '8px',
  boxShadow: '0 0 10px rgba(0,0,0,0.3)',
  zIndex: 1000
}}>
  <h4 style={{ marginTop: 0 }}>Legenda:</h4>
  {/* Mostrar info do filtro ativo */}
  {timeFilter !== 'all' && (
    <div style={{ 
      backgroundColor: '#e3f2fd', 
      padding: '5px 8px', 
      borderRadius: '4px', 
      marginBottom: '8px',
      fontSize: '11px',
      color: '#1565c0'
    }}>
      🕒 Mostrando: {timeFilter === '24h' ? 'Últimas 24h' : 
                    timeFilter === '48h' ? 'Últimas 48h' : 'Últimas 72h'}
    </div>
  )}
  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
    <li><img src={modisIcon} alt="MODIS" width={16} /> MODIS</li>
    <li><img src={snppIcon} alt="VIIRS S-NPP" width={16} /> VIIRS S-NPP</li>
    <li><img src={noaa20Icon} alt="VIIRS NOAA-20" width={16} /> VIIRS NOAA-20</li>
    <li><img src={noaa21Icon} alt="VIIRS NOAA-21" width={16} /> VIIRS NOAA-21</li>
    <p style={{ fontSize: '12px', margin: '10px 0 0 0', color: '#666' }}>
  💡 Use o controle de layers no canto <br />
  superior direito para mostrar/ocultar sensores
</p>
  </ul>
</div>

    </div>
  );
}

export default App;