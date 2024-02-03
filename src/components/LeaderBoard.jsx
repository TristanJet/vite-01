import { useState, useEffect } from 'react';

const httpUrl = import.meta.env.VITE_HTTP_SERVER_URL

export function LeaderBoard() {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`${httpUrl}/api/v1/leaderboard`, {
          method: "GET", 
          //credentials: "include", 
        });
        if (response.ok) {
          const jsonData = (await response.json()).content;
          setData(jsonData);
        } else {
          console.error('Failed to fetch');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }

    fetchData();
  }, []); // The empty array ensures this effect runs only once, similar to componentDidMount

  return (
    <div className="leaderboard-container">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {data.map((entry, index) => (
            <tr key={index}>
              <td>{entry.value}</td>
              <td>{entry.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
