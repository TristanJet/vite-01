import { GoogleOAuthProvider } from "@react-oauth/google";

import { QuoteDisplay } from "./components/QuoteDisplay.jsx";
import { GoogleLoginButton } from "./components/GoogleButton.jsx"

import "./App.css";

function App() {

  const authClick = async () => {
    const resp = await fetch('http://localhost:5000/auth')
    console.log(resp)
  }

  return (
    <>
      <GoogleOAuthProvider clientId="">
        <QuoteDisplay />
        <GoogleLoginButton />
        <button onClick={authClick} >Auth</button>
      </GoogleOAuthProvider>
    </>
  );
}

export default App;
