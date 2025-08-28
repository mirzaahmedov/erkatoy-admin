import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider, darkTheme } from "@adobe/react-spectrum";

import App from "./App";

import "./main.css";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Provider
        theme={darkTheme}
        id="provider"
      >
        <App />
      </Provider>
    </QueryClientProvider>
  </StrictMode>,
);
