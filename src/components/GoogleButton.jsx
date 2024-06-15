import { GoogleLogin } from "@react-oauth/google";

export function GoogleLoginButton({ isSigned, setSignedTrue }) {
  const handleLoginSuccess = async (credentialResponse) => {
    const response = await fetch("/api/v1/signin", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentialResponse),
    });
    if (response.ok) {
      setSignedTrue()
    } else {
      console.error('/signin error')
    }
  };

  const handleLoginError = () => {
    console.log("Login Failed");
    // Additional logic on error
  };

  return (
    <>
      {!isSigned && <GoogleLogin onSuccess={handleLoginSuccess} onError={handleLoginError} />}
    </>
  );
}
