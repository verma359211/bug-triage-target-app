import React from "react";
import { createRoot } from "react-dom/client";
import CartPage from "./CartPage";
import "./styles.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <CartPage />
  </React.StrictMode>,
);

