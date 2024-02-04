import { useState } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";

import { QuoteDisplay } from "./components/QuoteDisplay.jsx";
import { GoogleLoginButton } from "./components/GoogleButton.jsx"
import { LeaderBoard } from "./components/LeaderBoard.jsx";

import "./App.css";

const httpUrl = import.meta.env.VITE_HTTP_SERVER_URL
console.log(`${httpUrl}`)
const wsUrl = import.meta.env.VITE_WS_SERVER_URL
console.log(`${wsUrl}`)
const googleClient = import.meta.env.VITE_GOOGLE_CLIENT_ID
console.log(`${googleClient}`)

function AuthButton ({isConnected, clickHandler}) {

  if (isConnected) {
    return null
  } else {
    return (<button onClick={clickHandler} >Auth</button>)
  }
  
}

export function App() {

  const [ws, setWs] = useState(null)

  const authClick = async () => {
    const resp = await fetch(`${httpUrl}/api/v1/auth`, {
      method: "GET", 
      credentials: "include", 
    })
    const json = await resp.json()
    console.log(json.message)
    if (json.message === 'Authorized') {
      const ws = new WebSocket(`${wsUrl}/ws`)
      ws.onopen = () => {
        console.log('connected')
        setWs(ws)
      }
    }
  }

  return (
    <>
      <GoogleOAuthProvider clientId={googleClient}>
        <QuoteDisplay 
        websocket={ws}
        />
        <GoogleLoginButton />
        <AuthButton 
        isConnected={ws ? true : false} 
        clickHandler={authClick} 
        />
        <LeaderBoard />
      </GoogleOAuthProvider>
    </>
  );
}