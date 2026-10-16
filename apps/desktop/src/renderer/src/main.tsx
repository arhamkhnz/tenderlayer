import { StrictMode } from "react";
import { RouterProvider } from "@tanstack/react-router";
import { createRoot } from "react-dom/client";
import "@tenderlayer/fonts/fonts.css";
import "@tenderlayer/ui/globals.css";
import { router } from "./app/router";
import { loadPreferences } from "./app/preferences";
import { PreferencesProvider } from "./app/preferences-provider";

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
