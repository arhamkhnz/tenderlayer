import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { RouterProvider } from "@tanstack/react-router";

import "@tenderlayer/fonts/fonts.css";
import "@tenderlayer/ui/globals.css";

import { loadPreferences } from "./app/preferences";
import { PreferencesProvider } from "./app/preferences-provider";
import { router } from "./app/router";

async function startRenderer() {
  const preferences = await loadPreferences();
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <PreferencesProvider initialPreferences={preferences}>
        <RouterProvider router={router} />
      </PreferencesProvider>
    </StrictMode>,
  );
}

void startRenderer().catch((error) => {
  console.error("Failed to load application preferences", error);
  document.getElementById("root")!.textContent = "Unable to load application preferences. Please restart TenderLayer.";
});
