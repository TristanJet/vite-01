import { useState } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";

import { QuoteDisplay } from "./components/QuoteDisplay.jsx";
import { GoogleLoginButton } from "./components/GoogleButton.jsx";
import { LeaderBoard } from "./components/LeaderBoard.jsx";

import "./App.css";

const httpUrl = import.meta.env.VITE_HTTP_SERVER_URL;
const wsUrl = import.meta.env.VITE_WS_SERVER_URL;
const googleClient = import.meta.env.VITE_GOOGLE_CLIENT_ID;

function AuthButton({ isConnected, clickHandler }) {
  if (isConnected) {
    return null;
  } else {
    return <button onClick={clickHandler}>Auth</button>;
  }
}

export function App() {
  const [ws, setWs] = useState(null);
  const [gameState, setGameState] = useState(0);

  const authClick = async () => {
    const resp = await fetch(`${httpUrl}/api/v1/auth`, {
      method: "GET",
      credentials: "include",
    });
    const json = await resp.json();
    console.log(json.message);
    if (json.message === "Authorized") {
      const ws = new WebSocket(`${wsUrl}/ws?jet-token=${json.token}`);
      ws.onopen = () => {
        console.log("connected");
        setWs(ws);
      };
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data)
        if (data.type === 'FIN') {
          setGameState(1)
          console.log(`${data.name}: you typed the quote in ${data.finishTime} seconds!`)
        }
      }
    }
  };

  return (
    <>
      <GoogleOAuthProvider clientId={googleClient}>
        <QuoteDisplay websocket={ws} gameState={gameState} clearGameState={() => {setGameState(0)}} />
        <GoogleLoginButton />
        <AuthButton isConnected={ws ? true : false} clickHandler={authClick} />
        <LeaderBoard gameState={gameState} />
      </GoogleOAuthProvider>
    </>
  );
}
