import { RouterProvider } from "react-router-dom";
import "./App.css";
import router from "./router";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

function App() {
  return <RouterProvider router={router} />;
}

export default App;
