import React from 'react';
import { Marker, Popup, LayerGroup } from 'react-leaflet';
import { sensorIcons, fallbackIcon } from './mapConfig';
import { filterByTime } from './geoUtils';

export default function SensorMarkers({ data, sensorName, timeFilter }) {
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
            Brightness: {point.brightness || point.bright_ti4 || 'N/A'}<br />
            Date: {point.acq_date}<br />
            Time: {point.acq_time}<br />
            Satellite: {point.satellite}
          </Popup>
        </Marker>
      ))}
    </LayerGroup>
  );
}
