import React from "react";
import { createRoot } from "react-dom/client";
import { MantineProvider, createTheme } from "@mantine/core";
import "@mantine/core/styles.css";
import "./styles.css";
import App from "./App.jsx";

const theme = createTheme({
  fontFamily:
    "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
  headings: {
    fontFamily:
      "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
    fontWeight: "750"
  },
  primaryColor: "teal",
  defaultRadius: "md",
  colors: {
    ink: [
      "#f5f7f6",
      "#e5ebe9",
      "#ccd8d4",
      "#aebfba",
      "#849a94",
      "#647a74",
      "#485d58",
      "#324642",
      "#213531",
      "#142522"
    ]
  }
});

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <MantineProvider theme={theme} defaultColorScheme="light">
      <App />
    </MantineProvider>
  </React.StrictMode>
);
