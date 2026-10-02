"use client";

import { useEffect, useRef, useState } from "react";

export default function SummernoteEditor({
  value = "",
  onChange,
  placeholder = "Write blog content here...",
  height = 360,
}) {
  const editorRef = useRef(null);
  const isInitialized = useRef(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    // Helper to load CSS
    const loadCSS = (href, id) => {
      return new Promise((resolve) => {
        if (document.getElementById(id)) {
          resolve();
          return;
        }
        const link = document.createElement("link");
        link.id = id;
        link.rel = "stylesheet";
        link.href = href;
        link.onload = () => resolve();
        link.onerror = () => resolve(); // continue even if font/css fails
        document.head.appendChild(link);
      });
    };

    // Helper to load JS
    const loadScript = (src, id) => {
      return new Promise((resolve, reject) => {
        if (document.getElementById(id)) {
          resolve();
          return;
        }
        const script = document.createElement("script");
        script.id = id;
        script.src = src;
        script.async = true;
        script.onload = () => resolve();
        script.onerror = (e) => reject(e);
        document.body.appendChild(script);
      });
    };

    const initSummernote = async () => {
      try {
        // 1. Load CSS
        await loadCSS(
          "https://cdn.jsdelivr.net/npm/summernote@0.8.20/dist/summernote-lite.min.css",
          "summernote-lite-css"
        );

        // 2. Load jQuery if not already loaded
        if (typeof window !== "undefined" && !window.jQuery) {
          await loadScript(
            "https://code.jquery.com/jquery-3.7.1.min.js",
            "jquery-script"
          );
        }

        // 3. Load Summernote Lite JS if not already loaded
        if (
          typeof window !== "undefined" &&
          (!window.jQuery || !window.jQuery.fn || !window.jQuery.fn.summernote)
        ) {
          await loadScript(
            "https://cdn.jsdelivr.net/npm/summernote@0.8.20/dist/summernote-lite.min.js",
            "summernote-lite-js"
          );
        }

        if (!isMounted) return;

        const $ = window.jQuery;
        if (!$ || !$.fn || !$.fn.summernote || !editorRef.current) {
          setLoadError(true);
          setLoading(false);
          return;
        }

        // Initialize Summernote with comprehensive rich toolbar tools
        $(editorRef.current).summernote({
          placeholder: placeholder,
          tabsize: 2,
          height: height,
          minHeight: 220,
          maxHeight: 700,
          focus: false,
          toolbar: [
            ["style", ["style"]],
            ["font", ["bold", "italic", "underline", "strikethrough", "superscript", "subscript", "clear"]],
            ["fontname", ["fontname"]],
            ["fontsize", ["fontsize"]],
            ["color", ["color"]],
            ["para", ["ul", "ol", "paragraph", "height"]],
            ["table", ["table"]],
            ["insert", ["link", "picture", "video", "hr"]],
            ["view", ["fullscreen", "codeview", "help"]],
            ["history", ["undo", "redo"]],
          ],
          fontNames: [
            "Cormorant Garamond",
            "Playfair Display",
            "Inter",
            "Roboto",
            "Georgia",
            "Garamond",
            "Times New Roman",
            "Arial",
            "Arial Black",
            "Courier New",
            "Helvetica",
            "Verdana",
          ],
          fontNamesIgnoreCheck: ["Cormorant Garamond", "Playfair Display", "Inter", "Roboto"],
          callbacks: {
            onInit: function () {
              // Set initial content if present
              if (value) {
                $(editorRef.current).summernote("code", value);
              }
              isInitialized.current = true;
              setLoading(false);
            },
            onChange: function (contents) {
              if (onChange) {
                onChange(contents);
              }
            },
          },
        });
      } catch (err) {
        console.error("Summernote load error:", err);
        if (isMounted) {
          setLoadError(true);
          setLoading(false);
        }
      }
    };

    initSummernote();

    return () => {
      isMounted = false;
      if (
        typeof window !== "undefined" &&
        window.jQuery &&
        editorRef.current &&
        isInitialized.current
      ) {
        try {
          window.jQuery(editorRef.current).summernote("destroy");
        } catch {
          // ignore cleanup error
        }
        isInitialized.current = false;
      }
    };
  }, []);

  // Update content if value changes externally and is different from current
  useEffect(() => {
    if (
      isInitialized.current &&
      typeof window !== "undefined" &&
      window.jQuery &&
      editorRef.current
    ) {
      const currentVal = window.jQuery(editorRef.current).summernote("code");
      if (value !== currentVal && (value || currentVal)) {
        window.jQuery(editorRef.current).summernote("code", value || "");
      }
    }
  }, [value]);

  return (
    <div className="w-full summernote-custom-wrapper">
      {loading && (
        <div className="flex items-center gap-2 text-xs text-slate-400 py-2">
          <div className="w-4 h-4 border-2 border-slate-200 border-t-[#997b47] rounded-full animate-spin" />
          <span>Loading Summernote rich editor...</span>
        </div>
      )}

      {loadError && (
        <div className="mb-2 p-2 bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-lg">
          Rich editor failed to load from CDN. You can use standard formatting below.
        </div>
      )}

      <div style={{ display: loadError ? "none" : "block" }}>
        <textarea ref={editorRef} defaultValue={value} />
      </div>

      {loadError && (
        <textarea
          rows={12}
          value={value}
          onChange={(e) => onChange && onChange(e.target.value)}
          className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm focus:border-[#997b47] outline-none font-mono"
          placeholder={placeholder}
        />
      )}

      <style jsx global>{`
        .summernote-custom-wrapper .note-editor.note-frame {
          border: 1px solid #e2e8f0 !important;
          border-radius: 0.75rem !important;
          overflow: hidden;
          background: #ffffff;
        }
        .summernote-custom-wrapper .note-toolbar {
          background-color: #f8fafc !important;
          border-bottom: 1px solid #e2e8f0 !important;
          padding: 6px 8px !important;
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
        }
        .summernote-custom-wrapper .note-btn {
          background: #ffffff !important;
          border: 1px solid #e2e8f0 !important;
          border-radius: 6px !important;
          color: #334155 !important;
          padding: 4px 8px !important;
          font-size: 12px !important;
          line-height: 1.2 !important;
          transition: all 0.15s ease;
        }
        .summernote-custom-wrapper .note-btn:hover,
        .summernote-custom-wrapper .note-btn.active {
          background: #f1f5f9 !important;
          border-color: #cbd5e1 !important;
          color: #997b47 !important;
        }
        .summernote-custom-wrapper .note-dropdown-menu {
          z-index: 10001 !important;
          border-radius: 8px !important;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1) !important;
          border: 1px solid #e2e8f0 !important;
        }
        .summernote-custom-wrapper .note-modal {
          z-index: 10002 !important;
        }
        .summernote-custom-wrapper .note-editable {
          font-family: inherit;
          font-size: 15px;
          line-height: 1.7;
          color: #1e293b;
          padding: 16px !important;
          min-height: 220px;
        }
        .summernote-custom-wrapper .note-statusbar {
          background: #f8fafc !important;
          border-top: 1px solid #e2e8f0 !important;
        }
        .summernote-custom-wrapper .note-status-output {
          display: none;
        }
      `}</style>
    </div>
  );
}
