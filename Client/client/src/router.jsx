import { createBrowserRouter } from "react-router-dom";

import Login from "./Component/Login";
import VerifyEmail from "./Component/VerifyEmail";
import ResetPassword from "./Component/ResetPassword";
import VerifyForgotPasswordToken from "./Component/VerifyForgotPasswordToken";
import Chat from "./Page/Chat";
import LoginPage from "./Page/LoginPage";
import HomePage from "./Page/HomePage";
import Layout from "./Page/Layout";
import ErrorPage from "./Page/ErrorPage";
// import UserProvider from "./context/userContext";
// import TokenProvider from "./context/tokenContext";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: "/login/oauth",
        element: <Login />,
      },
      {
        path: "verify-email",
        element: <VerifyEmail />,
      },
      {
        path: "forgot-password",
        element: <VerifyForgotPasswordToken />,
      },
      {
        path: "reset-password",
        element: <ResetPassword />,
      },
      {
        path: "chat",
        element: <Chat />,
      },
    ],
  },
  {
    path: "Login",
    element: <LoginPage />,
  },
]);

export default router;
