import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import GameProvider from "./providers/game";
import QueryClientProvider from "./providers/query-client.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider>
      <GameProvider>
        <App />
      </GameProvider>
    </QueryClientProvider>
  </StrictMode>,
);
