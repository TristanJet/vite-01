import { useEffect, useState, useRef } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";

import { QuoteDisplay } from "./components/QuoteDisplay.jsx";
import { GoogleLoginButton } from "./components/GoogleButton.jsx";
import { LeaderBoard } from "./components/LeaderBoard.jsx";

import "./App.css";

const httpUrl = import.meta.env.VITE_HTTP_SERVER_URL;
const wsUrl = import.meta.env.VITE_WS_SERVER_URL;
const googleClient = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const isDev = import.meta.env.DEV;

export function App() {
  const [ws, setWs] = useState(null);
  const [gameState, setGameState] = useState(0);
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
            setGameState(1);
            console.log(
              `${parsed.name}: you typed the quote in ${parsed.finishTime} seconds!`
            );
          }
        };
        ws.onclose = () => {
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
        <div className="app-container">
          <div className="timer-container">
            <div className="running">0.0</div>
            <div className="last">(0.0)</div>
          </div>
          <div className="main-container">
            <div className="left-column">
              <div>Hi this is the left column</div>
            </div>
            <QuoteDisplay
              websocket={ws}
              gameState={gameState}
              clearGameState={() => {
                setGameState(0);
              }}
            />
            <div className="right-column">
              <LeaderBoard gameState={gameState} />
              {!isAuthed.current && <GoogleLoginButton />}
            </div>
          </div>
        </div>
      </GoogleOAuthProvider>
    </>
  );
}
