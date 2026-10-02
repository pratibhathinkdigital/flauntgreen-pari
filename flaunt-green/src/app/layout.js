import "./globals.css";
import { Cormorant_Garamond, Inter, Playwrite_AU_VIC, Cabin } from "next/font/google";
import { Providers } from "@/providers";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const playwriteAuVic = Playwrite_AU_VIC({
  subsets: ["latin"],
  variable: "--font-playwrite-au-vic",
  weight: "400",
  display: "swap",
});

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const cabin = Cabin({
  subsets: ["latin"],
  variable: "--font-cabin",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata = {
  title: {
    default: "Flaunt Green – Sustainably Crafted Timeless Fashion",
    template: "%s | Flaunt Green",
  },
  description:
    "Flaunt Green — sustainable luxury fashion brand in India. Discover eco-friendly clothing, organic handloom fabrics, and timeless silhouettes crafted with purpose. Ethical fashion for the conscious wardrobe.",
  keywords: [
    "sustainable fashion India",
    "eco-friendly clothing",
    "organic fabrics",
    "slow fashion brand",
    "ethical fashion India",
    "sustainable luxury fashion",
    "handloom clothing India",
    "conscious fashion",
    "khadi clothing",
    "Flaunt Green",
  ],
  authors: [{ name: "Flaunt Green" }],
  creator: "Flaunt Green",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "Flaunt Green – Sustainably Crafted Timeless Fashion",
    description: "Sustainable fashion crafted from organic handloom fabrics.",
    siteName: "Flaunt Green",
  },
  twitter: {
    card: "summary_large_image",
    title: "Flaunt Green – Sustainably Crafted Timeless Fashion",
    description: "Sustainable fashion crafted from organic handloom fabrics.",
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png?v=2", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png?v=2", sizes: "32x32", type: "image/png" },
      { url: "/favicon.ico?v=2", sizes: "any", type: "image/x-icon" },
    ],
    apple: [{ url: "/apple-touch-icon.png?v=2", sizes: "180x180", type: "image/png" }],
    shortcut: "/favicon.ico?v=2",
  },
  manifest: "/site.webmanifest?v=2",
};

export const viewport = {
  themeColor: "#41542f",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" dir="ltr" className={`${inter.variable} ${playwriteAuVic.variable} ${cormorantGaramond.variable} ${cabin.variable}`}>
      <body className="font-sans antialiased min-h-screen">
        <Providers>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: "#1e293b",
                color: "#f8fafc",
                borderRadius: "12px",
                fontSize: "14px",
                fontWeight: "500",
              },
              success: {
                iconTheme: { primary: "#22c55e", secondary: "#f8fafc" },
              },
              error: {
                iconTheme: { primary: "#ef4444", secondary: "#f8fafc" },
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
