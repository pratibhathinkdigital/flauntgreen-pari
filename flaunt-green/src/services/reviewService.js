import { SEED_REVIEWS } from "@/data/reviews";
import { reviewsApi } from "./api";

const STORAGE_KEY = "flontgreen_reviews_v1";

let cache = null;

function nowIso() {
  return new Date().toISOString();
}

function uid() {
  return `rev_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function load() {
  if (cache) return cache;
  if (typeof window === "undefined") return SEED_REVIEWS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        cache = parsed;
        return cache;
      }
    }
  } catch {
    /* corrupted storage */
  }
  cache = SEED_REVIEWS.map((r) => ({ ...r }));
  persist();
  return cache;
}

function persist() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
  } catch {
    /* storage quota / disabled */
  }
}

function sortNewest(list) {
  return [...list].sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt));
}

export const reviewService = {
  /** Approved reviews shown publicly for a product slug (cached / fallback). */
  getProductReviews(slug) {
    const all = load();
    return sortNewest(all.filter((r) => r.productSlug === slug && r.status === "approved"));
  },

  /** Composite stats computed from stored records. */
  getProductStats(slug) {
    const reviews = load().filter((r) => r.productSlug === slug && r.status === "approved");
    const count = reviews.length;
    const sum = reviews.reduce((acc, r) => acc + Number(r.rating || 0), 0);
    const avg = count ? Math.round((sum / count) * 10) / 10 : 0;
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((r) => {
      const k = Math.max(1, Math.min(5, Math.round(Number(r.rating) || 0)));
      distribution[k] += 1;
    });
    return { count, avg, distribution };
  },

  /** All records (for admin / moderation). */
  getAll() {
    return sortNewest(load());
  },

  /** Counts by moderation status (for admin). */
  getStatusCounts() {
    const all = load();
    return {
      total: all.length,
      approved: all.filter((r) => r.status === "approved").length,
      pending: all.filter((r) => r.status === "pending").length,
      hidden: all.filter((r) => r.status === "hidden").length,
    };
  },

  /**
   * Create a review: Saves directly to the Laravel backend database,
   * with fallback to client storage.
   */
  async create(input) {
    let serverRecord = null;
    try {
      const res = await reviewsApi.submit({
        name: input.author || input.name || "Anonymous",
        email: input.email || null,
        rating: Number(input.rating) || 5,
        title: input.title || null,
        body: input.body || "",
        product_slug: input.productSlug,
        product_name: input.productName || input.productSlug,
        product_id: input.productId || null,
      });
      if (res.data?.review) {
        serverRecord = res.data.review;
      }
    } catch (err) {
      console.error("Backend review submit error:", err);
    }

    const review = {
      id: serverRecord?.id || uid(),
      date: (serverRecord?.created_at || nowIso()).slice(0, 10),
      createdAt: serverRecord?.created_at || nowIso(),
      status: serverRecord?.status || input.status || "pending",
      verified: Boolean(serverRecord?.is_verified),
      ...input,
    };

    cache = [review, ...load().filter((r) => r.id !== review.id)];
    persist();
    return review;
  },

  update(id, patch) {
    const all = load();
    let updated = null;
    cache = all.map((r) => {
      if (r.id === id) {
        updated = { ...r, ...patch };
        return updated;
      }
      return r;
    });
    persist();
    return updated;
  },

  async setStatus(id, status) {
    try {
      await reviewsApi.updateStatus(id, status);
    } catch (err) {
      console.warn("Backend review status update failed:", err);
    }
    return this.update(id, { status });
  },

  async remove(id) {
    try {
      await reviewsApi.delete(id);
    } catch (err) {
      console.warn("Backend review delete failed:", err);
    }
    cache = load().filter((r) => r.id !== id);
    persist();
  },

  reset() {
    cache = SEED_REVIEWS.map((r) => ({ ...r }));
    persist();
  },
};