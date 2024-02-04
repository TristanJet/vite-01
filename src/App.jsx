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

  const authClick = async () => {
    const token = 12345
    const ws = new WebSocket(`${wsUrl}/ws?jet-token=${token}`);
    ws.onopen = () => {
      console.log("connected");
      setWs(ws);
    };
  };

  return (
    <>
      <GoogleOAuthProvider clientId={googleClient}>
        <QuoteDisplay websocket={ws} />
        <GoogleLoginButton />
        <AuthButton isConnected={ws ? true : false} clickHandler={authClick} />
        <LeaderBoard />
      </GoogleOAuthProvider>
    </>
  );
}
