import { useEffect, useState } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";

import { QuoteDisplay } from "./components/QuoteDisplay.jsx";
import { GoogleLoginButton } from "./components/GoogleButton.jsx";
import { LeaderBoard } from "./components/LeaderBoard.jsx";

import "./App.css";

const httpUrl = import.meta.env.VITE_HTTP_SERVER_URL;
const wsUrl = import.meta.env.VITE_WS_SERVER_URL;
const googleClient = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const isDev = import.meta.env.DEV

export function App() {
  const [ws, setWs] = useState(null);
  const [gameState, setGameState] = useState(0);

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
    
    const setupWebSocketConnection = async () => {
      try {
        const authMsg = await auth();
        if (authMsg.message === 'Authorized') {
          const ws = new WebSocket(`${wsUrl}/ws?jet-token=${authMsg.token}`);
          ws.onopen = () => {
            console.log("connected");
            setWs(ws);
          };
          ws.onmessage = (event) => {
            if (event.data === 'PING') {
              console.log('pinged');
              ws.send('PONG');
              return;
            }
            const parsed = JSON.parse(event.data);
            if (parsed.type === 'FIN') {
              setGameState(1);
              console.log(`${parsed.name}: you typed the quote in ${parsed.finishTime} seconds!`);
            }
          };
          ws.onclose = () => {
            console.log('Websocket closed');
          };
          ws.onerror = () => {
            console.log('Websocket error');
          };
        } else {
          console.log('Please sign in.');
        }
      } catch (error) {
        console.log('Server connection error', error);
      }
    };
    
    setupWebSocketConnection();
    
  }, [])


  return (
    <>
      <GoogleOAuthProvider clientId={googleClient}>
        <div className="main-container">
          <QuoteDisplay websocket={ws} gameState={gameState} clearGameState={() => {setGameState(0)}} />
          <div className="right-column">
            <LeaderBoard gameState={gameState} />
            <GoogleLoginButton />
          </div>
        </div>
      </GoogleOAuthProvider>
    </>
  );
}
