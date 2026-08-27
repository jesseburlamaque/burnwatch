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

  const hoursMap = {
    '24h': 24,
    '48h': 48,
    '72h': 72
  };

  const hoursToSubtract = hoursMap[filter];
  if (!hoursToSubtract) return data;

  const now = new Date();
  const cutoffTime = new Date(now.getTime() - (hoursToSubtract * 60 * 60 * 1000));

  return data.filter(point => {
    const pointDateTime = parseAcqDateTime(point.acq_date, point.acq_time);
    if (!pointDateTime) return true;
    return pointDateTime >= cutoffTime;
  });
}

function parseAcqDateTime(dateStr, timeStr) {
  if (!dateStr || !timeStr) return null;

  const time = String(timeStr).padStart(4, '0');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr) || !/^\d{4}$/.test(time)) return null;

  const parsed = new Date(`${dateStr}T${time.slice(0, 2)}:${time.slice(2, 4)}:00Z`);
  return isNaN(parsed.getTime()) ? null : parsed;
}
