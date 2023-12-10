import { GoogleOAuthProvider } from "@react-oauth/google";
import { GoogleLogin } from "@react-oauth/google";

import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const products = [
    { id: "123", title: "Tristan" },
    { id: "567", title: "Kasper" },
    { id: "890", title: "Jake" },
  ];

  const listItems = products.map((product) => (
    <li key={product.id}>{product.title}</li>
  ));

  return (
    <>
      <GoogleOAuthProvider clientId="644690595130-lv4cosg2kpei4347fc6d4842tm7vog87.apps.googleusercontent.com">
        <div>
          <a href="https://vitejs.dev" target="_blank">
            <img src={viteLogo} className="logo" alt="Vite logo" />
          </a>
          <a href="https://react.dev" target="_blank">
            <img src={reactLogo} className="logo react" alt="React logo" />
          </a>
        </div>
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
