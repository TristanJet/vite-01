import { useEffect, useState, useRef } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";

import { Timer } from "./components/Timer.jsx";
import { QuoteDisplay } from "./components/QuoteDisplay.jsx";
import { GoogleLoginButton } from "./components/GoogleButton.jsx";
import { LeaderBoard } from "./components/LeaderBoard.jsx";
import {UserDisplay} from "./components/UserDisplay.jsx"

import "./App.css";

const googleClient = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export function App() {
  const [ws, setWs] = useState(null);
  const [gameState, setGameState] = useState(false);
  const [lastTime, setLastTime] = useState(0);
  const [isAuthed, setIsAuthed] = useState(false);
  const [quoteSelected, setQuoteSelected] = useState(false);
  const isSignedIn = useRef(false);

  useEffect(() => {

    const fetchAuth = async () => {
      let fetchAttempts = 0;
      let parsed = {};
      while (!parsed.token && fetchAttempts < 2) {
        const resp = await fetch('/api/v1/auth', {
          method: "GET",
          credentials: "include",
        });
        fetchAttempts++
        console.log("Fetched " + fetchAttempts + " times.")
        if (resp.ok) {
          parsed = await resp.json()
        } else {
          console.error('Fetch error /auth: ' + err)
          break
        }
      }
      if (parsed.token) {
        setIsAuthed(true)
        setupWebSocketConnection(parsed.token)
      } else {
        console.error("Client cookie error.")
      }
    }

    const setupWebSocketConnection = (authToken) => {
      try {
        const url = `/ws?jet-token=${authToken}`;
        const ws = new WebSocket(url);
        ws.onopen = () => {
          console.log("connected");
          setQuoteSelected(true);
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
          setQuoteSelected(false);
          console.log("Websocket closed");
        };
        ws.onerror = () => {
          console.log("Websocket error");
        };
      } catch (error) {
        console.log("Server connection error", error);
      }
    };

    fetchAuth();
    
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
            <UserDisplay 
            isAuthed={isAuthed}
            quoteSelectedOff={()=> {
              setQuoteSelected(false)
            }}
            />
          </div>
          <QuoteDisplay
            quoteSelected={quoteSelected}
            setQuoteSelectTrue={() => {
              setQuoteSelected(true)
            }}
            send={(data)=> {
              ws.send(data)
            }}
            gameState={gameState}
            startGameState={() => {
              setGameState(true)
            }}
            clearGameState={() => {
              setGameState(false)
            }}
          />
          <div className="right-column">
            <LeaderBoard 
            gameState={gameState}
            quoteSelected={quoteSelected} 
            />
            {!isSignedIn.current && <GoogleLoginButton />}
          </div>
        </div>
      </GoogleOAuthProvider>
    </>
  );
}
