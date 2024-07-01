import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { ChakraProvider } from "@chakra-ui/react";
import { AdminAuthContextProvider } from "./config/context/adminAuthContext.jsx";
import { AuthContextProvider } from "./config/context/authContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthContextProvider>
      <AdminAuthContextProvider>
        <ChakraProvider>
          <App />
        </ChakraProvider>
      </AdminAuthContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
);
