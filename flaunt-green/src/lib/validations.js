/**
 * Validation schemas using Zod
 * Shared between forms across the app
 */
import { z } from "zod";

// ── Auth ─────────────────────────────────────────────────────────────────────

export const loginSchema = z.object({
  email:    z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z
  .object({
    name:            z.string().min(2, "Name must be at least 2 characters"),
    email:           z.string().email("Please enter a valid email"),
    password:        z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// ── Checkout ──────────────────────────────────────────────────────────────────

export const addressSchema = z.object({
  fullName: z.string().min(2, "Full name required"),
  phone:    z.string().min(10, "Valid phone number required"),
  line1:    z.string().min(5, "Address line 1 required"),
  line2:    z.string().optional(),
  city:     z.string().min(2, "City required"),
  state:    z.string().min(2, "State required"),
  pincode:  z.string().regex(/^\d{6}$/, "Enter a valid 6-digit pincode"),
  country:  z.string().default("India"),
});

// ── Reviews ───────────────────────────────────────────────────────────────────

export const reviewSchema = z.object({
  rating:  z.number().min(1).max(5),
  title:   z.string().min(3).max(100),
  comment: z.string().min(10, "Please write at least 10 characters"),
});

// ── Product (Admin) ───────────────────────────────────────────────────────────

export const productSchema = z.object({
  name:         z.string().min(3, "Product name required"),
  description:  z.string().min(20, "Description must be at least 20 characters"),
  price:        z.number().positive("Price must be positive"),
  comparePrice: z.number().positive().optional(),
  stock:        z.number().int().nonnegative(),
  category:     z.string().min(1, "Category required"),
  isActive:     z.boolean().default(true),
  isFeatured:   z.boolean().default(false),
});
