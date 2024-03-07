import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
export default function Login() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  useEffect(() => {
    const access_token = params.get("access_token");
    const refresh_token = params.get("refresh_token");
    const new_user = params.get("new_user");
    const verify = params.get("verify");
    console.log(verify);
    console.log(new_user);
    localStorage.setItem("access_token", access_token);
    localStorage.setItem("refresh_token", refresh_token);
    navigate("/");
  }, [params, navigate]);
  return <div>Login</div>;
}

export const getGoogleOAuthUrl = () => {
  const { VITE_GOOGLE_CLIENT_ID, VITE_REDIRECT_URI } = import.meta.env;
  const URL = "https://accounts.google.com/o/oauth2/v2/auth";
  const query = {
    client_id: VITE_GOOGLE_CLIENT_ID,
    redirect_uri: VITE_REDIRECT_URI,
    response_type: "code",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ].join(" "),
    prompt: "consent",
    access_type: "offline",
  };
  const queryString = new URLSearchParams(query).toString();
  return `${URL}?${queryString}`;
};
