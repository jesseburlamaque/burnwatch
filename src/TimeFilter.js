import React from 'react';

export default function TimeFilter({ timeFilter, setTimeFilter }) {
  const options = [
    { value: 'all', label: 'Todos os focos (7 dias)' },
    { value: '24h', label: 'Últimas 24h' },
    { value: '48h', label: 'Últimas 48h' },
    { value: '72h', label: 'Últimas 72h' },
  ];

  return (
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

      {options.map(opt => (
        <label key={opt.value} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
          <input
            type="radio"
            name="timeFilter"
            value={opt.value}
            checked={timeFilter === opt.value}
            onChange={(e) => setTimeFilter(e.target.value)}
            style={{ marginRight: '5px' }}
          />
          {opt.label}
        </label>
      ))}
    </div>
  );
}
