import { Suspense } from "react";
import Script from "next/script";
import CheckoutClient from "./CheckoutClient";

export const metadata = {
  title: "Checkout | Flaunt Green",
  description: "Complete your conscious purchase securely with Flaunt Green.",
};

export default function CheckoutPage() {
  return (
    <>
      {/* Load Razorpay Checkout SDK globally */}
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
      />
      <Suspense fallback={<div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center text-slate-500">Loading checkout...</div>}>
        <CheckoutClient />
      </Suspense>
    </>
  );
}
