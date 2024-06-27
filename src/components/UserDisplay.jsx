import { useEffect, useState, useRef } from "react";

export function UserDisplay({ isAuthed, quoteSelectedOff }) {
  const [userName, setUserName] = useState("");
  const userData = useRef({});

  useEffect(() => {
    fetchAndAuth(isAuthed).then((content) => {
      if (content) {
        userData.current = content.data;
        setUserName(content.username);
      }
    });
  }, [isAuthed]);

  const camelCaseToTitleCase = (camelCase) => {
    let displayText;
    if (camelCase === "avgWPM") {
      displayText = "avg. WPM";
    }
    if (camelCase === "totalCrowns") {
      displayText = "Total Crowns";
    }
    return displayText;
  };

  return (
    <div className="userdisplay-container">
      <table>
        <thead>
          {userName ? (
            <UserName username={userName} />
          ) : (
            <FormUserName
              isAuthed={isAuthed}
              setData={(content) => {
                userData.current = content.data;
                setUserName(content.username);
              }}
              quoteSelectedOff={() => {
                quoteSelectedOff();
              }}
            />
          )}
        </thead>
        <tbody>
          {Object.entries(userData.current || {}).map(([key, value]) => (
            <tr key={key}>
              <td>{camelCaseToTitleCase(key)}</td>
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
    console.log(formJson);
    const response = await fetch("/api/v1/user", {
      method: "POST",
      body: JSON.stringify(formJson),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if (response.ok) {
      const content = await fetchAndAuth(isAuthed);
      setData(content);
    } else {
      console.error("/user post error");
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
            <input name="name" placeholder="Name?" />
          </label>
          <button type="submit">send</button>
        </form>
      </td>
    </tr>
  );
}

function UserName({ username }) {
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
  return 0;
}
