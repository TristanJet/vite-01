import { useState, useEffect } from "react";

//const httpUrl = import.meta.env.VITE_HTTP_SERVER_URL;

export function LeaderBoard({ gameState, quoteSelected }) {
  const [data, setData] = useState([]);

  async function fetchData() {
    try {
      const response = await fetch('/api/v1/leaderboard', {
        method: "GET",
        credentials: "include",
      });
      if (response.status === 200) {
        const jsonData = (await response.json()).content;
        setData(jsonData);
      } else if (response.status === 204) {
        return
      } else {
        console.error("Failed to fetch");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  useEffect(() => {
    fetchData();
  }, [quoteSelected]);

  useEffect(() => {
    if (gameState) {
      fetchData()
    }
  }, [gameState])

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
}
