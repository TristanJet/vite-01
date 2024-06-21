import { useEffect, useState } from "react";

//import {UserName} from "./UserName"

//const httpUrl = import.meta.env.VITE_HTTP_SERVER_URL;

export function UserDisplay({ isAuthed, quoteSelectedOff }) {
  const [data, setData] = useState({ username: "", data: {} });
  useEffect(() => {
    fetchAndAuth(isAuthed, setData);
  }, [isAuthed]);

  return (
    <div className="userdisplay-container">
      <table>
        <thead>
          {data.username ? (
            <UserName username={data.username} />
          ) : (
            <FormUserName
              isAuthed={isAuthed}
              setData={(data) => {
                setData(data);
                console.log('User data was changed.')
              }}
              quoteSelectedOff={() => {
                quoteSelectedOff();
              }}
            />
          )}
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

function FormUserName({ isAuthed, setData, quoteSelectedOff }) {
  const submitHandle = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const formJson = Object.fromEntries(formData.entries());
    console.log(formJson)
    const response = await fetch("/api/v1/user", {
      method: "POST",
      body: JSON.stringify(formJson),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if (response.ok) {
      const jsonData = await fetchAndAuth(isAuthed);
      setData(jsonData);
    } else {
      console.error('/user post error')
    }
  };

  const focusHandle = () => {
    quoteSelectedOff();
  };

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
  );
}

function UserName(username) {
  return (
    <tr>
      <th>{username}</th>
      <th></th>
    </tr>
  );
}

async function fetchAndAuth(isAuthed) {
  if (isAuthed) {
    const response = await fetch("/api/v1/user", {
      method: "GET",
      credentials: "include",
    });
    if (response.ok) {
      return (await response.json()).content;
    } else {
      console.error("/user error");
    }
  }
}
