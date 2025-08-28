import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider, darkTheme } from "@adobe/react-spectrum";
import { NuqsAdapter } from "nuqs/adapters/react-router/v7";

import App from "./App";

import "./main.css";

const queryClient = new QueryClient();

ModuleRegistry.registerModules([AllCommunityModule]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Provider
        theme={darkTheme}
        id="provider"
      >
        <NuqsAdapter>
          <App />
        </NuqsAdapter>
      </Provider>
    </QueryClientProvider>
  </StrictMode>,
);
