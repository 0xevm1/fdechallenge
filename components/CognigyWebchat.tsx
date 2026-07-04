"use client";

import { useEffect, useState } from "react";

/**
 * Cognigy Webchat v3 embed.
 *
 * Loads the hosted webchat bundle and boots it against the endpoint config URL
 * from NEXT_PUBLIC_COGNIGY_WEBCHAT_CONFIG_URL. When the variable is unset the
 * page still works: a small dismissible notice replaces the chat bubble so the
 * demo site can ship before the Cognigy endpoint exists.
 *
 * Docs: https://docs.cognigy.com/webchat/v3/embedding/hosted-script
 */

interface WebchatInstance {
  open: () => void;
  close: () => void;
  toggle: () => void;
}

declare global {
  interface Window {
    initWebchat?: (
      configUrl: string,
      options?: Record<string, unknown>,
    ) => Promise<WebchatInstance>;
  }
}

const WEBCHAT_SCRIPT_SRC =
  "https://github.com/Cognigy/Webchat/releases/latest/download/webchat.js";

const configUrl = process.env.NEXT_PUBLIC_COGNIGY_WEBCHAT_CONFIG_URL;

export default function CognigyWebchat() {
  const [dismissed, setDismissed] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const url = configUrl;
    if (!url) return;

    // React Strict Mode / remounts: never inject the script twice.
    if (document.querySelector(`script[src="${WEBCHAT_SCRIPT_SRC}"]`)) return;

    const script = document.createElement("script");
    script.src = WEBCHAT_SCRIPT_SRC;
    script.async = true;
    script.onload = () => {
      window
        .initWebchat?.(url)
        .catch(() => setFailed(true));
    };
    script.onerror = () => setFailed(true);
    document.body.appendChild(script);
  }, []);

  const notice = !configUrl
    ? {
        title: "Webchat not configured",
        body: "Set NEXT_PUBLIC_COGNIGY_WEBCHAT_CONFIG_URL to your Cognigy endpoint config URL to enable the Nimbus assistant.",
      }
    : failed
      ? {
          title: "Webchat failed to load",
          body: "The Cognigy webchat script or endpoint config could not be loaded. Check the config URL and network access.",
        }
      : null;

  if (!notice || dismissed) return null;

  return (
    <aside
      role="status"
      className="fixed bottom-4 right-4 z-50 w-72 rounded-xl border border-mist bg-white p-4 shadow-lg shadow-spruce/10"
    >
      <div className="flex items-start justify-between gap-3">
        <p className="font-display text-sm font-semibold text-spruce">
          {notice.title}
        </p>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label="Dismiss webchat notice"
          className="-mr-1 -mt-1 rounded-md p-1 text-spruce/50 transition-colors hover:bg-mist hover:text-spruce focus-visible:outline-2 focus-visible:outline-pine"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M2 2l10 10M12 2L2 12"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
      <p className="mt-1.5 text-xs leading-5 text-spruce/70">{notice.body}</p>
    </aside>
  );
}
