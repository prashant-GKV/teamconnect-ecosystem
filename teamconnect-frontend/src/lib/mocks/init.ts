// Mock Service Worker initialization with singleton guard to prevent double-start errors in React StrictMode and Next.js Fast Refresh

declare global {
  interface Window {
    __mswStarted?: boolean;
    __mswInitPromise?: Promise<void>;
  }
}

export async function initMocks(): Promise<void> {
  if (typeof window === "undefined") return;
  if (process.env["NEXT_PUBLIC_USE_MOCKS"] === "false") return;

  if (window.__mswStarted) {
    return;
  }

  if (window.__mswInitPromise) {
    return window.__mswInitPromise;
  }

  window.__mswInitPromise = (async () => {
    try {
      const { worker } = await import("./browser");
      await Promise.race([
        worker.start({
          onUnhandledRequest: "bypass",
          serviceWorker: { url: "/mockServiceWorker.js" },
        }),
        new Promise((resolve) => setTimeout(resolve, 2000)),
      ]);
      window.__mswStarted = true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (
        msg.includes("already enabled") ||
        msg.includes("cannot configure an already enabled network")
      ) {
        // MSW already started in another module/refresh cycle
        window.__mswStarted = true;
        return;
      }
      console.warn("[MSW] Failed to initialize mock worker:", err);
    }
  })();

  return window.__mswInitPromise;
}
