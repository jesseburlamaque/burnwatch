import React, { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

export default function FitBoundsToROI({ geojson }) {
  const map = useMap();

  useEffect(() => {
    const bounds = L.geoJSON(geojson).getBounds();
    map.fitBounds(bounds, { padding: [20, 20] });
  }, [geojson, map]);

  return null;
}
