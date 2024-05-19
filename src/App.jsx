import { useEffect, useState, useRef } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";

import { Timer } from "./components/Timer.jsx";
import { QuoteDisplay } from "./components/QuoteDisplay.jsx";
import { GoogleLoginButton } from "./components/GoogleButton.jsx";
import { LeaderBoard } from "./components/LeaderBoard.jsx";
import {UserDisplay} from "./components/UserDisplay.jsx"

import "./App.css";

const wsUrl = import.meta.env.VITE_WS_SERVER_URL;
const googleClient = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export function App() {
  const [ws, setWs] = useState(null);
  const [gameState, setGameState] = useState(false);
  const [lastTime, setLastTime] = useState(0);
  const isSignedIn = useRef(false);

  useEffect(() => {

    const setupWebSocketConnection = (authToken) => {
      console.log('Hello')
      try {
        const url = `/ws?jet-token=${authToken}`;
        const ws = new WebSocket(url);
        ws.onopen = () => {
          console.log("connected");
          setWs(ws);
        };
        ws.onmessage = (event) => {
          if (event.data === "PING") {
            console.log("pinged");
            ws.send("PONG");
          }
          const parsed = JSON.parse(event.data);
          if (parsed.type === "FIN") {
            setGameState(false);
            setLastTime(parsed.finishTime)
            console.log(
              `${parsed.name}: you typed the quote in ${parsed.finishTime} seconds, with a speed of ${parsed.wpm} wpm!`
            );
          }
        };
        ws.onclose = () => {
          setGameState(false);
          console.log("Websocket closed");
        };
        ws.onerror = () => {
          console.log("Websocket error");
        };
      } catch (error) {
        console.log("Server connection error", error);
      }
    };

    fetch('/api/v1/auth', {
      method: "GET",
      credentials: "include",
    }).then(async (resp) => {
        const parsed = await resp.json()
        setupWebSocketConnection(parsed.token)
    }).catch((err) => {
      console.error(err)
    })
    
  }, []);

  return (
    <>
      <GoogleOAuthProvider clientId={googleClient}>
        <Timer 
          gameState={gameState}
          lastTime={lastTime}
        />
        <div className="main-container">
          <div className="left-column">
            <UserDisplay />
          </div>
          <QuoteDisplay
            websocket={ws}
            gameState={gameState}
            startGameState={() => {
              setGameState(true)
            }}
            clearGameState={() => {
              setGameState(false)
            }}
          />
          <div className="right-column">
            <LeaderBoard gameState={gameState} />
            {!isSignedIn.current && <GoogleLoginButton />}
          </div>
        </div>
      </GoogleOAuthProvider>
    </>
  );
}
