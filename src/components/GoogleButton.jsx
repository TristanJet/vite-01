import React from 'react';
import { GoogleLogin } from '@react-oauth/google';

export function GoogleLoginButton () {
  const handleLoginSuccess = (credentialResponse) => {
    console.log(credentialResponse);
    // Additional logic on success
  };

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