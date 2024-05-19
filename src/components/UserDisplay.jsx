import { useState } from "react"

//const httpUrl = import.meta.env.VITE_HTTP_SERVER_URL;

export function UserDisplay () {
  const [data, setData] = useState({ username: "", data: {} });

  const isAuthed = false;

  if (isAuthed) {
    fetch(`/api/v1/user`, {
      method: "GET",
      credentials: "include",
    }).then(async () => {
      const jsonData = (await response.json()).content;
      setData(jsonData);
    }).catch(() => {
      console.error("Failed to fetch");
    })
  }

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