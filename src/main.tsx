import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ThemeProvider,createTheme } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";

const theme = createTheme ({
  palette: {
    mode: "light",
    primary: {
      main:"#1976d2",
    },
    secondary: {
      main: "#9c27b0",
    },
    background: {
      default: "#f4f6f8",
      paper: "#ffff",
    },
    text: {
      primary: "#212121",
      secondary: "#757575",
    },
    custom:{
      sidebar: "#2c2c2c",
    } as any,
  }
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline>
        <App/>
      </CssBaseline>
    </ThemeProvider>
  </StrictMode>
)

