import { useEffect, useState } from "react"

//import {UserName} from "./UserName"

//const httpUrl = import.meta.env.VITE_HTTP_SERVER_URL;

export function UserDisplay ({ isAuthed, quoteSelectedOff }) {
  const [data, setData] = useState({ username: "", data: {} });
  useEffect( () => {
    fetchAndAuth(isAuthed, setData)
  }, [isAuthed])

  return (
    <div className="userdisplay-container">
      <table>
        <thead>
          <UserName 
          data={data}
          isAuthed={isAuthed}
          setData={(data) => {
            setData(data)
          }}
          quoteSelectedOff={()=> {
            quoteSelectedOff()
          }}
          />
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

function UserName({ data, isAuthed, setData, quoteSelectedOff }) {

  const submitHandle = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const formJson = Object.fromEntries(formData.entries());
    const response = await fetch('/api/v1/user', {
      method: "POST", 
      body: JSON.stringify(formJson),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if (response.ok) {
      fetchAndAuth(isAuthed, setData)
    }
  }

  const focusHandle = () => {
    quoteSelectedOff()
  }

  if (data.username) {
    return (
    <tr>
      <th>{data.username}</th>
      <th></th>   
    </tr>
    )
  } else {
    return (
    <tr>
      <td>
      <form onSubmit={submitHandle} onFocus={focusHandle}>
        <label>
          Enter name to be displayed here: <input name="name" />
        </label>
        <button type="submit">send</button>
      </form>
      </td>
    </tr>
  )}
}

function fetchAndAuth (isAuthed, setData) {
  if (isAuthed) {
    fetch('/api/v1/user', {
      method: "GET",
      credentials: "include",
    }).then(async (response) => {
      const jsonData = (await response.json()).content;
      setData(jsonData);
    }).catch(() => {
      console.error("Failed to fetch");
    })
  }
}