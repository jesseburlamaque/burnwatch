import React from 'react';
import modisIcon from './modis.png';
import snppIcon from './viirs_snpp.png';
import noaa20Icon from './viirs_noaa20.png';
import noaa21Icon from './viirs_noaa21.png';

export default function Legend({ timeFilter }) {
  return (
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
      </ul>

      <p style={{ fontSize: '12px', margin: '10px 0 0 0', color: '#666' }}>
        💡 Use o controle de layers no canto <br />
        superior direito para mostrar/ocultar sensores
      </p>
    </div>
  );
}
