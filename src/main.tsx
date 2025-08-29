import { StrictMode } from "react";

import { Provider, darkTheme } from "@adobe/react-spectrum";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { NuqsAdapter } from "nuqs/adapters/react-router/v7";
import { createRoot } from "react-dom/client";
import { ConfirmProvider } from "./features/confirm/components/ConfirmProvider";

import App from "./App";
import "./main.css";

const queryClient = new QueryClient();

ModuleRegistry.registerModules([AllCommunityModule]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Provider
        theme={darkTheme}
        scale="large"
        id="provider"
      >
        <NuqsAdapter>
          <App />
        </NuqsAdapter>

        <ConfirmProvider />
      </Provider>
    </QueryClientProvider>
  </StrictMode>,
);
