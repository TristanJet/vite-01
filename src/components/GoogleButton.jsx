import React from 'react';
import { GoogleLogin } from '@react-oauth/google';

const httpUrl = import.meta.env.VITE_HTTP_SERVER_URL

export function GoogleLoginButton () {
  const handleLoginSuccess = async (credentialResponse) => {
    const url = `${httpUrl}/api/v1/signin`

    const response = await fetch(url, {
      method: "POST", 
      mode: "cors",
      cache: "no-cache", 
      //credentials: "include", 
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow", 
      referrerPolicy: "no-referrer", 
      body: JSON.stringify(credentialResponse), 
    });
    const json = await response.json()
    console.log(json)
  }

  const handleLoginError = () => {
    console.log("Login Failed");
    // Additional logic on error
  };

  return (
    <GoogleLogin
      onSuccess={handleLoginSuccess}
      onError={handleLoginError}
    />
  );
};