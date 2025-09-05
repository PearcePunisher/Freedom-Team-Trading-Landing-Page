"use client";

import React, { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

interface IClosedWidgetProps {
  url?: string;
  title?: string;
  height?: number;
}

const SCRIPT_SRC = "https://app.iclosed.io/assets/widget.js";


export function generateIClosedWidget(): any{
  const location = useRouter();
  console.log("Location");
  console.log(location);
  const IClosedWidget2: React.FC<IClosedWidgetProps> = ({
  url = "https://app.iclosed.io/e/freedomteamtrading/freedom-team-strategy-session",
  title = "Strategy Session",
  height = 620,
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  console.log("IN the test innit fam!");
  useEffect(() => {
    if (typeof window === "undefined"){
      console.log("Window is broken!~");
      console.log(window);
      return;
    } 
      
    // Debug logging moved inside the client-only effect to prevent server-side errors
    try {
      console.log("iclosed-widget init, location:", window.location.href);
      console.log("iclosed-widget init, location:", window.location.href.split("?")[1]);
    } catch (e) {
      // ignore
      console.log("nah fam it's an error innit!");
    }

    // If the vendor script is already present by src, do nothing — we will rely on it to initialize itself. TEST
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
return IClosedWidget2;
}


export const IClosedWidget: React.FC<IClosedWidgetProps> = ({
  url = "https://app.iclosed.io/e/freedomteamtrading/freedom-team-strategy-session",
  title = "Strategy Session",
  height = 620,
}) => {
  var params = "";
  var final_url = "";
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Debug logging moved inside the client-only effect to prevent server-side errors
    try {
      console.log("iclosed-widget init, location:", window.location.href);
      console.log("iclosed-widget init, location:", window.location.href.split("?")[1]);
      var split_v = window.location.href.split("?");
      if(split_v.length>1){
        params = "?" + split_v[1];
      }
    } catch (e) {
      // ignore
    }

    // If the vendor script is already present by src, do nothing — we will rely on it to initialize itself. TEST
    const existing = document.querySelector(`script[src="${SCRIPT_SRC}"]`);
    if (!existing) {
      const script = document.createElement("script");
      script.src = SCRIPT_SRC;
      script.async = true;
      // Append to body so it doesn't block head parsing
      document.body.appendChild(script);
    }
    console.log("DATA DUMP");
    console.log("Script SRC");
    console.log(SCRIPT_SRC);
    console.log("URL: " + url);
    console.log("PArams: " + params);
    console.log("Ref: " + ref);
    final_url = url + params;
    // intentionally do not call or mutate the provider's globals or attempt to re-init the script
  }, []);

  return (
    <div
      ref={ref}
      className="iclosed-widget"
      data-url={final_url}
      title={title}
      style={{ width: "100%", height }}
    />
  );
};

export default IClosedWidget;

