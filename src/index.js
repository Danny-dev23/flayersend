import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";
import { CssBaseline, Step } from "@mui/material";
import { StepProvider } from "./utilits/StepContext/StepContext";
import { CartProvider } from "./utilits/CartContext/CartContext";
import { AlertProvider } from "./utilits/AlertContext/AlertContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <>
    <CssBaseline />
    <StepProvider>
      <CartProvider>
        <AlertProvider>
          <App />
        </AlertProvider>
      </CartProvider>
    </StepProvider>
  </>
);
