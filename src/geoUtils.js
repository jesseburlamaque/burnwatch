import L from 'leaflet';
import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import { point as turfPoint } from '@turf/helpers';

export function isInsideROI(lat, lon, geojson) {
  const pt = turfPoint([lon, lat]);
  return geojson.features.some(feature => booleanPointInPolygon(pt, feature));
}

export function getBBox(geojson) {
  const bounds = L.geoJSON(geojson).getBounds();
  const west = bounds.getWest().toFixed(4);
  const south = bounds.getSouth().toFixed(4);
  const east = bounds.getEast().toFixed(4);
  const north = bounds.getNorth().toFixed(4);
  return `${west},${south},${east},${north}`;
}

export function filterByTime(data, filter) {
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
    const dateStr = point.acq_date;
    const timeStr = point.acq_time;

    if (!dateStr || !timeStr) return true;

    const formattedTime = timeStr.length === 4
      ? `${timeStr.slice(0, 2)}:${timeStr.slice(2, 4)}`
      : timeStr;

    const pointDateTime = new Date(`${dateStr}T${formattedTime}:00`);
    return pointDateTime >= cutoffTime;
  });
}
