import React, { useState, useEffect, useCallback, useRef } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Timer } from "./components/Timer.jsx";
import { QuoteDisplay } from "./components/QuoteDisplay.jsx";
import { GoogleLoginButton } from "./components/GoogleButton.jsx";
import { LeaderBoard } from "./components/LeaderBoard.jsx";
import { UserDisplay } from "./components/UserDisplay.jsx";

import "./App.css";

const googleClient = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export function App() {
  const [gameState, setGameState] = useState(false);
  const [lastTime, setLastTime] = useState(0);
  const [auth, setAuth] = useState(null);
  const [quoteSelected, setQuoteSelected] = useState(false);
  const [isSigned, setSigned] = useState(true);
  const wsRef = useRef(null);
  const quoteRef = useRef("");

  const setupWebSocketConnection = (authToken) => {
    try {
      const url = `/ws?jet-token=${authToken}`;
      const ws = new WebSocket(url);
      ws.onopen = () => {
        console.log("connected");
        if (!quoteSelected) {
          setQuoteSelected(true);
        }
        console.log(ws);
        wsRef.current = ws;
      };
      ws.onmessage = (event) => {
        if (event.data === "PING") {
          console.log("pinged");
          ws.send("PONG");
        }
        const parsed = JSON.parse(event.data);
        if (parsed.type === "FIN") {
          setGameState(false);
          setLastTime(parsed.finishTime);
          console.log(
            `${parsed.name}: you typed the quote in ${parsed.finishTime} seconds, with a speed of ${parsed.wpm} wpm!`,
          );
        }
      };
      ws.onclose = () => {
        setGameState(false);
        setQuoteSelected(false);
        wsRef.current = null;
        console.log("Websocket closed");
      };
      ws.onerror = () => {
        console.log("Websocket error");
      };
    } catch (error) {
      console.log("Server connection error", error);
    }
  };

  useEffect(() => {
    if (quoteSelected && !wsRef.current && auth) {
      setupWebSocketConnection(auth);
    }
  }, [quoteSelected, auth]);

  useEffect(() => {
    const fetchAuth = async () => {
      let fetchAttempts = 0;
      while (fetchAttempts < 2) {
        const resp = await fetch("/api/v1/auth", {
          method: "GET",
          credentials: "include",
        });
        fetchAttempts++;
        if (resp.ok) {
          const parsed = await resp.json();
          if (parsed.authstatus) {
            return parsed;
          }
          if (fetchAttempts < 2) {
            const response = await fetch("api/v1/guest", {
              method: "GET",
              credentials: "include",
            });
            if (!response.ok) {
              return 0;
            }
          }
        } else {
          return 0;
        }
      }
      return 0;
    };

    const fetchQuote = async () => {
      const resp = await fetch("/api/v1/quote", {
        method: "GET",
        credentials: "include",
      });
      if (resp.ok) {
        return (await resp.json()).content.quote;
      } else {
        return 0;
      }
    };

    fetchAuth().then((authobj) => {
      if (authobj) {
        setAuth(authobj.token);
        if (!authobj.signed) {
          setSigned(false);
        }
        fetchQuote().then((quote) => {
          if (quote) {
            quoteRef.current = quote;
            setupWebSocketConnection(authobj.token);
          } else {
            console.error("Fetch error /quote: ");
          }
        });
      } else {
        console.error("Fetch error /auth: ");
      }
    });
  }, []);

  const sendCallback = useCallback((data) => {
    if (wsRef.current) {
      wsRef.current.send(data);
    } else {
      console.log("No websocket connection: " + wsRef.current);
    }
  }, []);

  return (
    <>
      <GoogleOAuthProvider clientId={googleClient}>
        <Timer gameState={gameState} lastTime={lastTime} />
        <div className="main-container">
          <div className="left-column">
            <UserDisplay
              isAuthed={auth ? true : false}
              quoteSelectedOff={() => {
                setQuoteSelected(false);
              }}
            />
          </div>
          <QuoteDisplay
            quote={quoteRef.current}
            quoteSelected={quoteSelected}
            setQuoteSelectTrue={() => {
              setQuoteSelected(true);
            }}
            send={sendCallback}
            gameState={gameState}
            startGameState={() => {
              setGameState(true);
            }}
            clearGameState={() => {
              setGameState(false);
            }}
          />
          <div className="right-column">
            <LeaderBoard gameState={gameState} quoteSelected={quoteSelected} />
            {!isSigned && <GoogleLoginButton />}
          </div>
        </div>
      </GoogleOAuthProvider>
    </>
  );
}
