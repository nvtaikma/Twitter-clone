/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useState } from "react";
import useQueryParams from "../Component/useQueryParams";
import axios from "axios";
import { useNavigate } from "react-router-dom";
function VerifyForgotPasswordToken() {
  const { token } = useQueryParams();
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    if (token) {
      axios
        .post(
          `/users/verify-forgot-password`,
          { forgot_password_token: token },
          {
            baseURL: import.meta.env.VITE_API_URL,
          }
        )
        .then(() => {
          navigate(`/reset-password`, {
            state: { forgot_password_token: token },
          });
        })
        .catch((err) => {
          setMessage(err.response.data.message);
        });
    }
  }, [token, navigate]);
  return <div>{message}</div>;
}

export default VerifyForgotPasswordToken;
