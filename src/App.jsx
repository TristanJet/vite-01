import { GoogleOAuthProvider } from "@react-oauth/google";
import { GoogleLogin } from "@react-oauth/google";

import { QuoteDisplay } from "./components/QuoteDisplay.jsx"

import "./App.css";

function App() {

  return (
    <>
      <GoogleOAuthProvider clientId="">
        <QuoteDisplay />
        <h1>Tristan is very cool</h1>
        <GoogleLogin
          onSuccess={(credentialResponse) => {
            console.log(credentialResponse);
          }}
          onError={() => {
            console.log("Login Failed");
          }}
        />
      </GoogleOAuthProvider>
    </>
  );
}

export default App;
