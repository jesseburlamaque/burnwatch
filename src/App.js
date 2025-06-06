import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Corrigir ícones no React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

function App() {
  const [fireData, setFireData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFireData = async () => {
      const mapKey = '8c1c11a32d143574a95e6060f6636548';
      const apiUrl = `https://firms.modaps.eosdis.nasa.gov/api/area/csv/${mapKey}/MODIS_NRT/world/1`;

      try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const textData = await response.text();
        const rows = textData.split('\n').map(r => r.split(','));
        const headers = rows[0];
        const data = rows.slice(1).map(row => {
          const obj = {};
          headers.forEach((h, i) => (obj[h] = row[i]));
          return obj;
        });
        setFireData(data.filter(d => d.latitude && d.longitude)); // remove vazios
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchFireData();
  }, []);

  if (loading) return <div>Loading fire data...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>NASA FIRMS Fire Data (Map)</h1>
      <MapContainer center={[0, 0]} zoom={2} style={{ height: '80vh', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="© OpenStreetMap contributors"
        />
        {fireData.map((point, i) => (
          <Marker key={i} position={[+point.latitude, +point.longitude]}>
            <Popup>
              <strong>{point.brightness}</strong><br />
              Date: {point.acq_date}<br />
              Satellite: {point.satellite}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default App;
