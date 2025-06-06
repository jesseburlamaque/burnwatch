import React, { useEffect, useState } from 'react';

function App() {
  const [fireData, setFireData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFireData = async () => {
      // NASA FIRMS MAP_KEY
      const mapKey = '8c1c11a32d143574a95e6060f6636548'; //YOUR_MAP_KEY
      // URL for MODIS data for the world for the last 1 day
      const apiUrl = `https://firms.modaps.eosdis.nasa.gov/api/area/csv/${mapKey}/MODIS_NRT/world/1`;

      try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const textData = await response.text();
        // Assuming the response is CSV, parse it
        const rows = textData.split('\n').map(row => row.split(','));
        // Basic parsing, assumes header row and comma delimiter
        const headers = rows[0];
        const data = rows.slice(1).map(row => {
          const rowData = {};
          headers.forEach((header, index) => {
            rowData[header] = row[index];
          });
          return rowData;
        });
        setFireData(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchFireData();
  }, []);

  if (loading) {
    return <div>Loading fire data...</div>;
  }

  if (error) {
    return <div>Error loading fire data: {error.message}</div>;
  }

  return (
    <div className="App">
      <h1>NASA FIRMS Fire Data</h1>
      <table>
        <thead>
          <tr>
            {fireData.length > 0 && Object.keys(fireData[0]).map(header => (
              <th key={header}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {fireData.map((row, index) => (
            <tr key={index}>
              {Object.values(row).map((value, i) => (
                <td key={i}>{value}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;


