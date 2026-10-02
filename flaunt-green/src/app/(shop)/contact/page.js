"use client";

import { useState, useEffect } from "react";
import { Mail, Phone, MapPin, MessageCircle, Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { contactApi, settingsApi } from "@/services/api";

const SUBJECTS = [
  "General Enquiry",
  "Order Issue",
  "Return / Exchange",
  "Product Information",
  "Wholesale / Bulk Order",
  "Press & Collaborations",
  "Other",
];

const initialForm = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
};

export default function ContactPage() {
  const [form, setForm]       = useState(initialForm);
  const [errors, setErrors]   = useState({});
  const [status, setStatus]   = useState("idle"); // idle | loading | success | error
  const [apiError, setApiError] = useState("");
  const [settings, setSettings] = useState({
    support_email: "support@flauntgreen.in",
    support_phone: "+91-7710030888",
    store_address: "9 & 10, ADI House (Ground Floor), Vijay Manjrekar Rd, Chandrakant Dhuru Wadi, Dadar West, Mumbai, Maharashtra 400028"
  });

  useEffect(() => {
    settingsApi.getAll().then((res) => {
      if (res.data) setSettings(res.data);
    }).catch(console.error);
  }, []);

  const contactDetails = [
    {
      icon: MapPin,
      label: "Visit Us",
      lines: settings.store_address.split("\n"),
    },
    {
      icon: Mail,
      label: "Email Us",
      lines: [settings.support_email],
      href: `mailto:${settings.support_email}`,
    },
    {
      icon: Phone,
      label: "Call Us",
      lines: [settings.support_phone],
      href: `tel:${settings.support_phone}`,
    },
    {
      icon: MessageCircle,
      label: "WhatsApp",
      lines: [settings.support_phone],
      href: `https://wa.me/${settings.support_phone.replace(/[^0-9]/g, "")}`,
    },
  ];

  const validate = () => {
    const e = {};
    if (!form.name.trim())    e.name    = "Name is required.";
    if (!form.email.trim())   e.email   = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Enter a valid email address.";
    if (!form.subject)        e.subject = "Please select a subject.";
    if (!form.message.trim()) e.message = "Message is required.";
    else if (form.message.trim().length < 10)
      e.message = "Message must be at least 10 characters.";
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }
    setStatus("loading");
    setApiError("");
    try {
      await contactApi.send(form);
      setStatus("success");
      setForm(initialForm);
      setErrors({});
    } catch (err) {
      setStatus("error");
      const msg =
        err?.response?.data?.message ||
        "Something went wrong. Please try again.";
      setApiError(msg);
    }
  };

  const inputBase =
    "w-full border bg-white px-5 py-3.5 text-sm text-text-primary focus:outline-none transition-all duration-200 placeholder:text-gray-300";
  const inputNormal = `${inputBase} border-ivory-dark focus:border-brand-500 focus:ring-1 focus:ring-brand-500/20`;
  const inputError  = `${inputBase} border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-200 bg-red-50`;

  return (
    <div className="bg-white min-h-screen">

      {/* ── Hero Header ── */}
      <div className="relative bg-[#1a2213] overflow-hidden">
        {/* decorative circles */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#41542f]/30 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-72 h-72 rounded-full bg-[#997b47]/20 blur-3xl pointer-events-none" />

        <div className="container-site relative z-10 py-20 md:py-28">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#c8a96e] mb-4">
            Get in Touch
          </p>
          <h1 className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl text-white leading-tight mb-5">
            We&apos;d love to<br className="hidden md:block" /> hear from you.
          </h1>
          <p className="text-white/60 text-base max-w-md leading-relaxed">
            Questions about our collections, sustainability, orders — or just want to say hello? Drop us a message.
          </p>
        </div>
      </div>

      {/* ── Main Grid ── */}
      <div className="container-site py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-16 lg:gap-20">

          {/* ── Left: Contact Details ── */}
          <div className="lg:col-span-2 space-y-10">
            <div>
              <h2 className="font-heading font-bold text-2xl text-midnight mb-2">
                Our Details
              </h2>
              <p className="text-text-secondary text-sm leading-relaxed">
                Reach us through any channel below. We typically respond within 1–2 business days.
              </p>
            </div>

            <div className="space-y-8">
              {contactDetails.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex items-start gap-4 group">
                    {/* icon ring */}
                    <div className="w-11 h-11 rounded-full border-2 border-brand-500 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-brand-500 transition-colors duration-300">
                      <Icon className="w-4 h-4 text-brand-500 group-hover:text-white transition-colors duration-300" />
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-sm text-midnight mb-1 uppercase tracking-wider">
                        {item.label}
                      </h3>
                      {item.href ? (
                        <a
                          href={item.href}
                          target={item.href.startsWith("http") ? "_blank" : undefined}
                          rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                          className="text-text-secondary hover:text-brand-500 transition-colors text-sm leading-relaxed block"
                        >
                          {item.lines[0]}
                        </a>
                      ) : (
                        item.lines.map((line, i) => (
                          <p key={i} className="text-text-secondary text-sm leading-relaxed">
                            {line}
                          </p>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Hours block */}
            <div className="border border-ivory-dark p-6 bg-[#faf9f6]">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold mb-3">
                Studio Hours
              </p>
              <div className="space-y-2 text-sm text-text-secondary">
                <div className="flex justify-between">
                  <span>Monday – Saturday</span>
                  <span className="font-medium text-midnight">10:00 AM – 7:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span className="font-medium text-midnight">Closed</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Right: Contact Form ── */}
          <div className="lg:col-span-3">

            {/* Success state */}
            {status === "success" ? (
              <div className="flex flex-col items-center justify-center text-center py-20 border border-brand-500/30 bg-brand-500/5">
                <CheckCircle2 className="w-14 h-14 text-brand-500 mb-5" />
                <h3 className="font-heading font-bold text-2xl text-midnight mb-3">
                  Message Sent!
                </h3>
                <p className="text-text-secondary max-w-sm mb-8 text-sm leading-relaxed">
                  Thank you for reaching out. We&apos;ve received your message and will get back to you within 1–2 business days.
                </p>
                <button
                  onClick={() => setStatus("idle")}
                  className="text-xs font-bold uppercase tracking-widest text-brand-500 border border-brand-500 px-8 py-3 hover:bg-brand-500 hover:text-white transition-all duration-300"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <>
                <div className="mb-8">
                  <h2 className="font-heading font-bold text-2xl text-midnight mb-2">
                    Send a Message
                  </h2>
                  <p className="text-text-secondary text-sm">
                    Fill in the form below and we&apos;ll be in touch shortly.
                  </p>
                </div>

                {/* API error banner */}
                {status === "error" && apiError && (
                  <div className="flex items-start gap-3 bg-red-50 border border-red-200 px-5 py-4 mb-6 text-red-700 text-sm">
                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                    <span>{apiError}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} noValidate className="space-y-6">

                  {/* Name + Phone */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="cf-name"
                        className="text-xs font-bold uppercase tracking-widest text-text-muted block mb-2"
                      >
                        Full Name <span className="text-red-400">*</span>
                      </label>
                      <input
                        id="cf-name"
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Jane Doe"
                        className={errors.name ? inputError : inputNormal}
                      />
                      {errors.name && (
                        <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />{errors.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="cf-phone"
                        className="text-xs font-bold uppercase tracking-widest text-text-muted block mb-2"
                      >
                        Phone <span className="text-text-muted/50">(optional)</span>
                      </label>
                      <input
                        id="cf-phone"
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="+91 98765 43210"
                        className={inputNormal}
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="cf-email"
                      className="text-xs font-bold uppercase tracking-widest text-text-muted block mb-2"
                    >
                      Email Address <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="cf-email"
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="jane@example.com"
                      className={errors.email ? inputError : inputNormal}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />{errors.email}
                      </p>
                    )}
                  </div>

                  {/* Subject */}
                  <div>
                    <label
                      htmlFor="cf-subject"
                      className="text-xs font-bold uppercase tracking-widest text-text-muted block mb-2"
                    >
                      Subject <span className="text-red-400">*</span>
                    </label>
                    <select
                      id="cf-subject"
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      className={`${errors.subject ? inputError : inputNormal} appearance-none cursor-pointer bg-[url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")] bg-no-repeat bg-[right_1rem_center]`}
                    >
                      <option value="">Select a topic…</option>
                      {SUBJECTS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    {errors.subject && (
                      <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />{errors.subject}
                      </p>
                    )}
                  </div>

                  {/* Message */}
                  <div>
                    <label
                      htmlFor="cf-message"
                      className="text-xs font-bold uppercase tracking-widest text-text-muted block mb-2"
                    >
                      Message <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      id="cf-message"
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      placeholder="How can we help you?"
                      rows={6}
                      className={`${errors.message ? inputError : inputNormal} resize-none`}
                    />
                    <div className="flex justify-between items-start mt-1.5">
                      {errors.message ? (
                        <p className="text-red-500 text-xs flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />{errors.message}
                        </p>
                      ) : <span />}
                      <p className="text-xs text-text-muted text-right shrink-0 ml-4">
                        {form.message.length} / 2000
                      </p>
                    </div>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    id="contact-submit-btn"
                    className="w-full flex items-center justify-center gap-2.5 bg-brand-500 text-ivory px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-brand-600 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {status === "loading" ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Sending…
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Send Message
                      </>
                    )}
                  </button>

                  <p className="text-xs text-text-muted text-center">
                    We respect your privacy. Your details are only used to respond to your enquiry.
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Footer Note ── */}
      <div className="border-t border-ivory-dark">
        <div className="container-site py-8 text-center">
          <p className="text-xs text-text-muted">
            For international orders, please email us at{" "}
            <a href="mailto:support@flauntgreen.in" className="text-brand-500 hover:underline">
              support@flauntgreen.in
            </a>{" "}
            or WhatsApp us at{" "}
            <a href="https://wa.me/917710030888" target="_blank" rel="noopener noreferrer" className="text-brand-500 hover:underline">
              +91-7710030888
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
