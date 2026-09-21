import React, { useEffect, useRef } from "react";
import "@/servai.css";
import markup from "@/servaiMarkup";
import { initServAI } from "@/servaiScript";
import dashboardImg from "@/assets/dashboard.png";
import dataImg from "@/assets/data_explorer.png";

/**
 * ServAI homepage.
 *
 * The reference is a fully self-contained standalone HTML/CSS/JS page whose
 * interactivity (hero chat autoplay, product-journey stepper, multilingual
 * translation demo, business-case calculator, scroll parallax, etc.) is written
 * as vanilla DOM logic keyed off ids/classes under #sv10.
 *
 * To keep ALL of that functional logic 100% intact while rendering it inside
 * React, we inject the original markup once and run the original interaction
 * script against it after mount. The CSS is preserved verbatim in servai.css.
 */
const ServAIHome = () => {
  const containerRef = useRef(null);
  const initialised = useRef(false);

  useEffect(() => {
    if (initialised.current) return; // guard against StrictMode double-invoke
    if (!containerRef.current) return;

    const html = markup
      .replace(/__DASHBOARD_IMG__/g, dashboardImg)
      .replace(/__DATA_IMG__/g, dataImg);

    containerRef.current.innerHTML = html;
    initialised.current = true;

    // Run the original self-contained interaction logic.
    try {
      initServAI();
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error("ServAI init error", e);
    }
  }, []);

  return <div ref={containerRef} className="servai-root" />;
};

export default ServAIHome;
