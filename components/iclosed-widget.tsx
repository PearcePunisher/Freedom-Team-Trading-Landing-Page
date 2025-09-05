"use client";

import React, { useEffect, useRef } from "react";

interface IClosedWidgetProps {
  url?: string;
  title?: string;
  height?: number;
}

const SCRIPT_SRC = "https://app.iclosed.io/assets/widget.js";

export const IClosedWidget: React.FC<IClosedWidgetProps> = ({
  url = "https://app.iclosed.io/e/freedomteamtrading/freedom-team-strategy-session",
  title = "Strategy Session",
  height = 620,
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  console.log("test in the iframe");
  useEffect(() => {
    if (typeof window === "undefined") return;

    // If the vendor script is already present by src, do nothing — we will rely on it to initialize itself.
    const existing = document.querySelector(`script[src="${SCRIPT_SRC}"]`);
    if (!existing) {
      const script = document.createElement("script");
      script.src = SCRIPT_SRC;
      script.async = true;
      // Append to body so it doesn't block head parsing
      document.body.appendChild(script);
    }

    // intentionally do not call or mutate the provider's globals or attempt to re-init the script
  }, []);

  return (
    <div
      ref={ref}
      className="iclosed-widget"
      data-url={url}
      title={title}
      style={{ width: "100%", height }}
    />
  );
};

export default IClosedWidget;
