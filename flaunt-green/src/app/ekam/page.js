"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function EkamRedirectPage() {
  useEffect(() => {
    window.location.replace("/collections/ekam/");
  }, []);

  return (
    <div
      style={{
        minHeight: "60vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "12px",
        padding: "40px 24px",
        textAlign: "center",
        fontFamily: "var(--font-body), 'Inter', sans-serif",
        color: "#6b7280",
      }}
    >
      <p>Redirecting to the E.K.A.M. collection&hellip;</p>
      <Link href="/collections/ekam" style={{ color: "#997b47", textDecoration: "underline" }}>
        Go to E.K.A.M.
      </Link>
    </div>
  );
}