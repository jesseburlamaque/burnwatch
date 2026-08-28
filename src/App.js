import React, { useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, LayersControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const { BaseLayer, Overlay } = LayersControl;
import roi from './roi.json';

import { useFireData } from './useFireData';
import { SENSOR_TYPES, sensorIconUrls } from './mapConfig';
import FitBoundsToROI from './FitBoundsToROI';
import SensorMarkers from './SensorMarkers';
import TimeFilter from './TimeFilter';

function App() {
  const [timeFilter, setTimeFilter] = useState('all');
  const { fireData, loading, error, sensorErrors } = useFireData();
  const stadiaKey = process.env.REACT_APP_STADIA_API_KEY;

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
      <h2>Burn Watch - FIRMS Fire Data Viewer</h2>

      {sensorErrors.length > 0 && (
        <div style={{
          backgroundColor: '#fff3cd',
          color: '#856404',
          padding: '10px 15px',
          borderRadius: '8px',
          margin: '10px 0'
        }}>
          ⚠️ Dados parciais: sem dados de {sensorErrors.join(', ')}.
        </div>
      )}

      <TimeFilter timeFilter={timeFilter} setTimeFilter={setTimeFilter} />

      <MapContainer center={[0, 0]} zoom={3} style={{ height: '85vh', width: '100%' }}>
        <LayersControl position="topright">
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
              url={`https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}.png?api_key=${stadiaKey}`}
              attribution="&copy; <a href='https://stadiamaps.com/'>Stadia Maps</a>, &copy; Satellite Imagery"
            />
          </BaseLayer>

          {SENSOR_TYPES.map(sensorType => (
            <Overlay
              key={sensorType}
              checked
              name={`<img src="${sensorIconUrls[sensorType]}" width="20" height="20" style="vertical-align:middle;margin-right:6px;border-radius:3px;"> ${sensorType}`}
            >
              <SensorMarkers data={fireData} sensorName={sensorType} timeFilter={timeFilter} />
            </Overlay>
          ))}

          <Overlay checked name="🗺️ Região de Interesse">
            <GeoJSON
              data={roi}
              style={{
                color: 'black',
                weight: 2,
                fillOpacity: 0,
                dashArray: '4 4'
              }}
            />
          </Overlay>
        </LayersControl>

        <FitBoundsToROI geojson={roi} />
      </MapContainer>
    </div>
  );
}

export default App;
