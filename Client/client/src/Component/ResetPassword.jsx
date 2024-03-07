import axios from "axios";
import { useState } from "react";
import { useLocation } from "react-router-dom";

export default function ResetPassword() {
  const location = useLocation();

  const [data, setData] = useState({
    password: "",
    confirm_password: "",
    forgot_password_token: location.state.forgot_password_token,
  });

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const resetPassword = async (e) => {
    e.preventDefault();

    console.log("data", data);
    await axios
      .post(`/users/reset-password`, data, {
        baseURL: import.meta.env.VITE_API_URL,
      })
      .then((res) => {
        alert(res.data.result.message);
      })
      .catch((err) => {
        alert(err.response.data.message);
      });
  };
  return (
    <div>
      <h1>Reset Password</h1>
      <div>
        <input
          type="password"
          placeholder="new password"
          name="password"
          onChange={(e) => {
            handleChange(e);
          }}
        />
      </div>
      <div>
        <input
          type="password"
          placeholder="confirm password"
          name="confirm_password"
          onChange={(e) => {
            handleChange(e);
          }}
        />
      </div>
      <button type="button" onClick={resetPassword}>
        Reset password
      </button>
    </div>
  );
}
