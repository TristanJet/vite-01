import { GoogleOAuthProvider } from "@react-oauth/google";

import { QuoteDisplay } from "./components/QuoteDisplay.jsx";
import { GoogleLoginButton } from "./components/GoogleButton.jsx"

import "./App.css";

function App() {

  const authClick = async () => {
    const resp = await fetch('http://localhost:5000/api/v1/auth', {
      method: 'GET'
    })
    console.log(resp)
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

export default App;
