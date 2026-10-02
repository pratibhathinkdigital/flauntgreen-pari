"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error("Global Layout Error:", error);
  }, [error]);

  return (
    <html lang="en">
      <head>
        <title>Application Error | Flaunt Green</title>
      </head>
      <body style={{
        margin: 0,
        padding: 0,
        fontFamily: "'Cormorant Garamond', Georgia, serif, -apple-system, sans-serif",
        backgroundColor: "#FAF8F5",
        color: "#1C2A3A",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        <div style={{
          maxWidth: "600px",
          width: "90%",
          margin: "40px auto",
          textAlign: "center",
          padding: "48px 32px",
          backgroundColor: "#FFFFFF",
          borderRadius: "24px",
          border: "1px solid #E7E5E4",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.02)",
        }}>
          {/* Brand mark */}
          <div style={{
            fontSize: "24px",
            fontWeight: "700",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "#41542f",
            marginBottom: "24px",
          }}>
            FLAUNT GREEN
          </div>

          <div style={{
            display: "inline-block",
            padding: "6px 16px",
            borderRadius: "9999px",
            backgroundColor: "rgba(65, 84, 47, 0.1)",
            color: "#41542f",
            fontSize: "12px",
            fontWeight: "600",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            marginBottom: "16px",
          }}>
            Critical System Notice
          </div>

          <h1 style={{
            fontSize: "32px",
            fontWeight: "600",
            color: "#141b28",
            margin: "0 0 16px",
            lineHeight: 1.2,
          }}>
            We Are Experiencing a Technical Stitch
          </h1>

          <p style={{
            fontSize: "15px",
            color: "#57534E",
            lineHeight: 1.6,
            marginBottom: "32px",
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          }}>
            Our sustainable atelier encountered an unexpected problem while rendering. Please click below to refresh the page and resume your journey.
          </p>

          <div style={{
            display: "flex",
            gap: "12px",
            justifyContent: "center",
            flexWrap: "wrap",
          }}>
            <button
              onClick={() => {
                if (typeof reset === "function") reset();
                if (typeof window !== "undefined") window.location.reload();
              }}
              style={{
                backgroundColor: "#41542f",
                color: "#FFFFFF",
                border: "none",
                borderRadius: "12px",
                padding: "14px 28px",
                fontSize: "13px",
                fontWeight: "600",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                cursor: "pointer",
                transition: "background 0.2s",
              }}
            >
              Refresh &amp; Reconnect
            </button>

            <Link
              href="/"
              style={{
                backgroundColor: "transparent",
                color: "#41542f",
                border: "1px solid #D6D3D1",
                borderRadius: "12px",
                padding: "14px 28px",
                fontSize: "13px",
                fontWeight: "600",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                textDecoration: "none",
                display: "inline-block",
              }}
            >
              Return to Home
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
