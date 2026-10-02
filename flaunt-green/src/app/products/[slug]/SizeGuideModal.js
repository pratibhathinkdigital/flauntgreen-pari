"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { getSizeGuide } from "@/data/sizeGuide";

export default function SizeGuideModal({ open, onClose, breadcrumbPath = "" }) {
  const { title, chart, note } = getSizeGuide(breadcrumbPath);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  // Extract sizes for the top header row
  const sizes = chart.map((row) => row.size);
  // Extract measurement types (e.g., "bust", "waist", "hips") for the left column
  const measurementKeys = Object.keys(chart[0] || {}).filter((key) => key !== "size");

  // Helper to capitalize the measurement name
  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Size Guide"
    >
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div
        className="relative w-full max-w-2xl bg-white shadow-2xl rounded-xl p-8"
        style={{ maxHeight: "90vh", overflowY: "auto" }}
      >
        <button
          onClick={onClose}
          aria-label="Close size guide"
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mt-4">
          <h3
            className="font-heading mb-4"
            style={{
              fontFamily: "var(--font-heading), 'Cormorant Garamond', serif",
              fontSize: "26px",
              color: "#1a1a1a",
            }}
          >
            {title === "Women's Size Guide" ? "Women's Body Measurements in Inches" : title}
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-center border-collapse border border-black">
              <thead>
                <tr className="bg-black text-white">
                  <th className="py-3 px-4 border border-black font-serif text-lg text-left bg-black text-white w-1/4">
                    {/* Empty top-left cell */}
                  </th>
                  {sizes.map((size) => (
                    <th key={size} className="py-3 px-4 border border-black font-serif text-lg font-normal bg-black text-white">
                      {size}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {measurementKeys.map((key) => (
                  <tr key={key} className="bg-white hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4 border border-black text-left font-serif text-lg text-[#1a1a1a]">
                      {capitalize(key)}
                    </td>
                    {chart.map((row) => (
                      <td key={`${key}-${row.size}`} className="py-4 px-4 border border-black font-serif text-lg text-[#1a1a1a]">
                        {row[key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {note && (
            <p className="text-sm mt-6 text-gray-600 font-sans">
              * {note}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}