import {StrictMode, startTransition} from "react";
import {hydrateRoot} from "react-dom/client";
import {StartClient} from "@tanstack/react-start/client";

function shouldSkipHydration(pathname: string): boolean {
  const parts = pathname.split("/").filter(Boolean);
  return parts.length >= 2 && parts[1] === "api";
}

if (!shouldSkipHydration(window.location.pathname)) {
  startTransition(() => {
    hydrateRoot(
      document,
      <StrictMode>
        <StartClient />
      </StrictMode>
    );
  });
}
