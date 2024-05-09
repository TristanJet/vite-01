import { useEffect, useState, useRef } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";

import { Timer } from "./components/Timer.jsx";
import { QuoteDisplay } from "./components/QuoteDisplay.jsx";
import { GoogleLoginButton } from "./components/GoogleButton.jsx";
import { LeaderBoard } from "./components/LeaderBoard.jsx";
import {UserDisplay} from "./components/UserDisplay.jsx"

import "./App.css";

const httpUrl = import.meta.env.VITE_HTTP_SERVER_URL;
const wsUrl = import.meta.env.VITE_WS_SERVER_URL;
const googleClient = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const isDev = import.meta.env.DEV;

export function App() {
  const [ws, setWs] = useState(null);
  const [gameState, setGameState] = useState(false);
  const [lastTime, setLastTime] = useState(0);
  const isAuthed = useRef(false);

  useEffect(() => {
    const auth = async () => {
      if (isDev) {
        return {
          message: "Authorized",
          token: 12345,
        };
      }
      const response = await fetch(`${httpUrl}/api/v1/auth`, {
        method: "GET",
        credentials: "include",
      });
      const respJson = await response.json();
      return respJson;
    };

    const setupWebSocketConnection = async (authToken) => {
      try {
        const ws = new WebSocket(`${wsUrl}/ws?jet-token=${authToken}`);
        ws.onopen = () => {
          console.log("connected");
          setWs(ws);
        };
        ws.onmessage = (event) => {
          if (event.data === "PING") {
            console.log("pinged");
            ws.send("PONG");
            return;
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

    auth()
      .then((authMsg) => {
        if (authMsg.message === "Authorized") {
          isAuthed.current = true;
          setupWebSocketConnection(authMsg.token);
        } else {
          console.log(authMsg);
          console.log("Please sign in!");
        }
      })
      .catch(() => {
        console.log("Auth request failed");
      });
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
            {!isAuthed.current && <GoogleLoginButton />}
          </div>
        </div>
      </GoogleOAuthProvider>
    </>
  );
}
