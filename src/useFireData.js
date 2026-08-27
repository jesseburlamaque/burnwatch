import React, { useState, useEffect } from 'react';
import roi from './roi.json';
import { getBBox, isInsideROI } from './geoUtils';
import { FIRMS_SENSORS } from './mapConfig';

const CACHE_KEY = 'burnwatch_cache_v2';
const CACHE_TTL = 60 * 60 * 1000; // 1 hora em ms
const DAY_RANGE = 7;

function readCache() {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;
    const { data, sensorErrors, timestamp } = JSON.parse(cached);
    if (!Array.isArray(data) || Date.now() - timestamp >= CACHE_TTL) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }
    return { data, sensorErrors: Array.isArray(sensorErrors) ? sensorErrors : [] };
  } catch (e) {
    localStorage.removeItem(CACHE_KEY);
    return null;
  }
}

function writeCache(data, sensorErrors) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ data, sensorErrors, timestamp: Date.now() }));
  } catch (e) {
    console.warn('Falha ao salvar cache:', e.message);
  }
}

async function fetchSensorData(sensor, mapKey, bbox) {
  const url = `https://firms.modaps.eosdis.nasa.gov/api/area/csv/${mapKey}/${sensor.name}/${bbox}/${DAY_RANGE}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Error from ${sensor.label}: ${response.status}`);
  const text = await response.text();
  const rows = text.trim().split('\n').map(r => r.split(','));
  const headers = rows[0];
  if (!headers || !headers.includes('latitude')) {
    throw new Error(`Invalid response from ${sensor.label}`);
  }
  return rows.slice(1).map(row => {
    const obj = {};
    headers.forEach((h, i) => obj[h] = row[i]);
    obj.sensor = sensor.label;
    return obj;
  });
}

export function useFireData() {
  const [fireData, setFireData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sensorErrors, setSensorErrors] = useState([]);

  useEffect(() => {
    const fetchAllSensors = async () => {
      const mapKey = process.env.REACT_APP_FIRMS_KEY;

      if (!mapKey) {
        setError(new Error('REACT_APP_FIRMS_KEY não está configurada. Defina a variável no arquivo .env.'));
        setLoading(false);
        return;
      }

      const cached = readCache();
      if (cached) {
        setFireData(cached.data);
        setSensorErrors(cached.sensorErrors);
        setLoading(false);
        return;
      }

      const bbox = getBBox(roi);

      try {
        const results = await Promise.allSettled(
          FIRMS_SENSORS.map(sensor => fetchSensorData(sensor, mapKey, bbox))
        );

        const sensorData = [];
        const failedSensors = [];

        results.forEach((result, i) => {
          if (result.status === 'fulfilled') {
            sensorData.push(result.value);
          } else {
            failedSensors.push(FIRMS_SENSORS[i].label);
            console.warn(`Sensor ${FIRMS_SENSORS[i].label} falhou:`, result.reason.message);
          }
        });

        const flatData = sensorData.flat();

        if (flatData.length === 0 && failedSensors.length > 0) {
          throw new Error(`Nenhum dado recebido (falha em: ${failedSensors.join(', ')}). Verifique sua conexão ou a chave da API.`);
        }

        const merged = flatData.filter(d => {
          const lat = parseFloat(d.latitude);
          const lon = parseFloat(d.longitude);
          return lat && lon && isInsideROI(lat, lon, roi);
        });

        console.log(`[DEBUG] Total dados: ${flatData.length}, Dentro ROI: ${merged.length}`);
        setFireData(merged);
        setSensorErrors(failedSensors);
        writeCache(merged, failedSensors);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllSensors();
  }, []);

  return { fireData, loading, error, sensorErrors };
}
