import { useState } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";

import { QuoteDisplay } from "./components/QuoteDisplay.jsx";
import { GoogleLoginButton } from "./components/GoogleButton.jsx"

import "./App.css";

const sessionId = import.meta.env.VITE_SESH

function AuthButton ({isConnected, clickHandler}) {

  if (isConnected) {
    return null
  } else {
    return (<button onClick={clickHandler} >Auth</button>)
  }
  
}

export function App() {

  const [connected, setConnected] = useState(false)
  const [ws, setWs] = useState(null)

  const authClick = async () => {
    const resp = await fetch('https://localhost:5000/api/v1/auth', {
      method: "GET", 
      credentials: "include", 
    })
    const json = await resp.json()
    console.log(json.message)
    if (json.message === 'Authorized') {
      const ws = new WebSocket('wss://localhost:5000/ws')
      ws.onopen = () => {
        console.log('connected')
        setConnected(true)
        setWs(ws)
      }
    }
  }

  return (
    <>
      <GoogleOAuthProvider clientId="644690595130-lv4cosg2kpei4347fc6d4842tm7vog87.apps.googleusercontent.com">
        <QuoteDisplay 
        websocket={ws}
        />
        <GoogleLoginButton />
        <AuthButton 
        isConnected={connected} 
        clickHandler={authClick} 
        />
      </GoogleOAuthProvider>
    </>
  );
}