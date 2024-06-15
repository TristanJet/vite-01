import { GoogleLogin } from "@react-oauth/google";

export function GoogleLoginButton({}) {
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
      window.location.reload()
    } else {
      console.error('/signin error')
    }
  };

  const handleLoginError = () => {
    console.log("Login Failed");
    // Additional logic on error
  };

  return (
    <GoogleLogin onSuccess={handleLoginSuccess} onError={handleLoginError}/>
  );
}
