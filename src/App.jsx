import { GoogleOAuthProvider } from "@react-oauth/google";

import { QuoteDisplay } from "./components/QuoteDisplay.jsx";
import { GoogleLoginButton } from "./components/GoogleButton.jsx"

import "./App.css";

document.cookie = `jet-session=${import.meta.env.APISESSIONID}; path=/; domain=localhost; Secure; SameSite=None`;

export function App() {

  const authClick = async () => {
    const resp = await fetch('https://localhost:5000/api/v1/auth', {
      method: "GET", 
      credentials: "include", 
    })
    const json = await resp.json()
    console.log(json)
  }

  return (
    <>
      <GoogleOAuthProvider clientId="644690595130-lv4cosg2kpei4347fc6d4842tm7vog87.apps.googleusercontent.com">
        <QuoteDisplay />
        <GoogleLoginButton />
        <button onClick={authClick} >Auth</button>
      </GoogleOAuthProvider>
    </>
  );
}