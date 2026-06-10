import React, { useState, useEffect } from 'react';
import roi from './roi.json';
import { getBBox, isInsideROI } from './geoUtils';
import { FIRMS_SENSORS } from './mapConfig';

const CACHE_KEY = 'burnwatch_cache';
const CACHE_TTL = 60 * 60 * 1000; // 1 hora em ms

export function useFireData() {
  const [fireData, setFireData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllSensors = async () => {
      const mapKey = process.env.REACT_APP_FIRMS_KEY;

      const cached = sessionStorage.getItem(CACHE_KEY);
      if (cached) {
        try {
          const { data, timestamp } = JSON.parse(cached);
          if (Date.now() - timestamp < CACHE_TTL) {
            setFireData(data);
            setLoading(false);
            return;
          }
        } catch (e) {
          sessionStorage.removeItem(CACHE_KEY);
        }
      }

      const bbox = getBBox(roi);

      try {
        const results = await Promise.allSettled(
          FIRMS_SENSORS.map(async (sensor) => {
            const url = `https://firms.modaps.eosdis.nasa.gov/api/area/csv/${mapKey}/${sensor.name}/${bbox}/2`;
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Error from ${sensor.label}: ${response.status}`);
            const text = await response.text();
            const rows = text.trim().split('\n').map(r => r.split(','));
            const headers = rows[0];
            return rows.slice(1).map(row => {
              const obj = {};
              headers.forEach((h, i) => obj[h] = row[i]);
              obj.sensor = sensor.label;
              return obj;
            });
          })
        );

        const allData = results
          .filter(r => r.status === 'fulfilled')
          .map(r => r.value)
          .flat();

        results.forEach((result, i) => {
          if (result.status === 'rejected') {
            console.warn(`Sensor ${FIRMS_SENSORS[i].label} falhou:`, result.reason.message);
          }
        });

        const merged = allData.filter(d => {
          const lat = parseFloat(d.latitude);
          const lon = parseFloat(d.longitude);
          return lat && lon && isInsideROI(lat, lon, roi);
        });

        console.log(`[DEBUG] Total dados: ${allData.length}, Dentro ROI: ${merged.length}`);
        setFireData(merged);

        sessionStorage.setItem(CACHE_KEY, JSON.stringify({ data: merged, timestamp: Date.now() }));
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllSensors();
  }, []);

  return { fireData, loading, error };
}
