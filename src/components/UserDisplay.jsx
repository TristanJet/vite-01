import { useState, useEffect } from "react"

const httpUrl = import.meta.env.VITE_HTTP_SERVER_URL;

export function UserDisplay () {
  const [data, setData] = useState({ username: "", data: {} });

  async function fetchData() {
    try {
      const response = await fetch(`${httpUrl}/api/v1/user`, {
        method: "GET",
        credentials: "include",
      });
      if (response.ok) {
        const jsonData = (await response.json()).content;
        setData(jsonData);
      } else {
        console.error("Failed to fetch");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="userdisplay-container">
      <table>
        <thead>
          <tr>
            <th>{data.username || "Loading..."}</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(data.data || {}).map(([key, value]) => (
            <tr key={key}>
              <td>{key}</td>
              <td>{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}