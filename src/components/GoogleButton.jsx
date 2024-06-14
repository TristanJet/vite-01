import React from "react";
import { GoogleLogin } from "@react-oauth/google";

export function GoogleLoginButton() {
  const handleLoginSuccess = async (credentialResponse) => {
    const url = '/api/v1/signin';

    const response = await fetch(url, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentialResponse),
    });
    const json = await response.json();
    console.log(json);
  };

  const handleLoginError = () => {
    console.log("Login Failed");
    // Additional logic on error
  };

  return (
    <GoogleLogin onSuccess={handleLoginSuccess} onError={handleLoginError} />
  );
}
