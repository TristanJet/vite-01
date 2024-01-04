import { GoogleOAuthProvider } from "@react-oauth/google";

import { QuoteDisplay } from "./components/QuoteDisplay.jsx";
import { GoogleLoginButton } from "./components/GoogleButton.jsx"

import "./App.css";

function App() {

  return (
    <>
      <GoogleOAuthProvider clientId="">
        <QuoteDisplay />
        <h1>Tristan is very cool</h1>
        <GoogleLoginButton />
      </GoogleOAuthProvider>
    </>
  );
}

export default App;
