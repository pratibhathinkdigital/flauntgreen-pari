"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Star, CheckCircle, Clock, ThumbsUp, Camera, X, 
  Upload, Filter, MessageSquare, ChevronDown, ChevronUp,
  AlertCircle, Sparkles, Check, Lock
} from "lucide-react";
import toast from "react-hot-toast";
import { reviewsApi } from "@/services/api";
import { useAuthStore } from "@/store/authStore";
import { getImageUrl } from "@/lib/axios";

const RATING_LABELS = {
  1: "Poor",
  2: "Fair",
  3: "Good",
  4: "Very Good",
  5: "Exceptional / Loved it!",
};

export default function ProductReviewsSection({ slug, productName, productId }) {
  const { user, isAuthenticated } = useAuthStore();
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({
    count: 0,
    avg: 0,
    distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  });
  const [loading, setLoading] = useState(true);

  // Form State
  const [form, setForm] = useState({
    name: "",
    email: "",
    rating: 5,
    title: "",
    body: "",
  });
  const [images, setImages] = useState([]); // Base64 strings for submission
  const [hoverRating, setHoverRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [formOpen, setFormOpen] = useState(false);

  // Filter State
  const [activeRatingFilter, setActiveRatingFilter] = useState("all");
  const [withPhotosOnly, setWithPhotosOnly] = useState(false);

  // Lightbox Modal
  const [lightboxImage, setLightboxImage] = useState(null);

  // Pre-fill user data when user changes
  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        name: prev.name || user.name || "",
        email: prev.email || user.email || "",
      }));
    }
  }, [user]);

  // Fetch reviews for this product
  const loadReviews = useCallback(async () => {
    if (!slug) return;
    try {
      setLoading(true);
      const currentUser = useAuthStore.getState().user;
      const res = await reviewsApi.getByProduct(slug, {
        user_id: currentUser?.id,
        email: currentUser?.email,
      });

      if (res.data) {
        setReviews(res.data.reviews || []);
        if (res.data.stats) {
          setStats(res.data.stats);
        }
      }
    } catch (err) {
      console.warn("Failed to load reviews notice:", err?.message || err);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  // Handle Photo Upload
  const handlePhotoSelect = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    if (images.length + files.length > 4) {
      toast.error("You can upload a maximum of 4 photos per review.");
      return;
    }

    files.forEach((file) => {
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload image files only (PNG, JPG, WebP).");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB.");
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        setImages((prev) => [...prev, reader.result].slice(0, 4));
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Submit Review
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error("Please sign in to submit a review.");
      return;
    }

    const name = form.name.trim();
    const body = form.body.trim();
    if (!name || !body || form.rating === 0) {
      toast.error("Please fill in your name, star rating, and review message.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await reviewsApi.submit({
        name,
        email: user?.email || form.email.trim() || null,
        rating: form.rating,
        title: form.title.trim() || null,
        body,
        product_slug: slug,
        product_name: productName || slug,
        product_id: productId || null,
        images,
      });

      toast.success(
        res.data?.message || "Thank you! Your review has been submitted successfully."
      );

      // Reset form
      setForm({
        name: user?.name || "",
        email: user?.email || "",
        rating: 5,
        title: "",
        body: "",
      });
      setImages([]);
      setFormOpen(false);

      // Refresh dynamic review list
      await loadReviews();
    } catch (err) {
      console.error("Submit review error:", err);
      const errMsg = err.response?.data?.message || err.response?.data?.error || "Failed to submit review. Please try again.";
      toast.error(errMsg);
    } finally {
      setSubmitting(false);
    }
  };

  // Helpful vote
  const handleHelpful = async (reviewId) => {
    try {
      const res = await reviewsApi.markHelpful(reviewId);
      if (res.data?.likes_count !== undefined) {
        setReviews((prev) =>
          prev.map((r) =>
            r.id === reviewId ? { ...r, likes_count: res.data.likes_count, has_voted: true } : r
          )
        );
        toast.success("Thank you for your feedback!");
      }
    } catch (err) {
      console.error("Helpful vote error:", err);
    }
  };

  // Filtered reviews
  const filteredReviews = useMemo(() => {
    return reviews.filter((r) => {
      const matchRating = activeRatingFilter === "all" || Number(r.rating) === Number(activeRatingFilter);
      const matchPhotos = !withPhotosOnly || (r.images && r.images.length > 0);
      return matchRating && matchPhotos;
    });
  }, [reviews, activeRatingFilter, withPhotosOnly]);

  // All photos across reviews for photo gallery strip
  const allCustomerPhotos = useMemo(() => {
    const list = [];
    reviews.forEach((r) => {
      if (r.images && Array.isArray(r.images)) {
        r.images.forEach((img) => {
          list.push({
            img,
            author: r.name,
            rating: r.rating,
            date: r.created_at || r.date,
          });
        });
      }
    });
    return list;
  }, [reviews]);

  const maxDist = Math.max(1, ...Object.values(stats.distribution || {}));

  return (
    <div id="pdp-reviews" className="space-y-10 animate-fade-in pt-4">
      {/* ── Top Overview & Action ── */}
      <div className="bg-[#FAF8F5] rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-soft-sm">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          
          {/* Left: Overall Rating Score */}
          <div className="md:col-span-4 text-center md:text-left md:border-r border-stone-200/80 md:pr-8">
            <div className="flex items-center justify-center md:justify-start gap-3">
              <span className="text-5xl font-serif font-bold text-[#141b28]">
                {stats.count > 0 ? Number(stats.avg).toFixed(1) : "—"}
              </span>
              <div>
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        stats.avg >= star
                          ? "fill-[#997b47] text-[#997b47]"
                          : stats.avg >= star - 0.5
                          ? "fill-[#997b47]/50 text-[#997b47]"
                          : "text-stone-300"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-stone-500 mt-1 font-medium">
                  Based on {stats.count} {stats.count === 1 ? "verified review" : "verified reviews"}
                </p>
              </div>
            </div>
            <p className="text-xs text-stone-500 mt-3 leading-relaxed">
              Every review comes from conscious fashion lovers and is verified for authentic feedback.
            </p>
            <button
              onClick={() => setFormOpen(!formOpen)}
              className="mt-4 w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#41542f] hover:bg-[#344326] text-white text-xs font-semibold uppercase tracking-wider transition-all shadow-soft-sm flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              {formOpen ? "Close Form" : "Write a Review"}
            </button>
          </div>

          {/* Middle: Rating Breakdown Bars */}
          <div className="md:col-span-8 space-y-2">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = stats.distribution?.[star] || 0;
              const pct = stats.count > 0 ? Math.round((count / stats.count) * 100) : 0;
              const isSelected = activeRatingFilter === String(star);

              return (
                <div
                  key={star}
                  onClick={() => setActiveRatingFilter(isSelected ? "all" : String(star))}
                  className={`flex items-center gap-3 text-xs cursor-pointer px-2 py-1 rounded-lg transition-colors ${
                    isSelected ? "bg-stone-200/60 font-semibold" : "hover:bg-stone-100"
                  }`}
                >
                  <span className="w-12 text-stone-700 flex items-center gap-1 font-medium">
                    {star} <Star className="w-3 h-3 fill-[#997b47] text-[#997b47]" />
                  </span>
                  <div className="flex-1 h-2 bg-stone-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#997b47] rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="w-12 text-right text-stone-500 text-[11px]">
                    {count} ({pct}%)
                  </span>
                </div>
              );
            })}
          </div>

        </div>
      </div>

      {/* ── Expandable Write Review Form or Login Gate ── */}
      {formOpen && !isAuthenticated && (
        <div className="bg-[#FAF8F5] rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-md animate-scale-up text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-[#41542f]/10 flex items-center justify-center mx-auto text-[#41542f]">
            <Lock className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-serif font-bold text-[#141b28]">Sign In to Share Your Review</h3>
          <p className="text-xs text-stone-600 max-w-md mx-auto leading-relaxed">
            We value genuine reviews from our conscious fashion community. Please sign in to your account to write a review and upload product photos.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href={`/login?redirect=/products/${slug}#pdp-reviews`}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#41542f] hover:bg-[#344326] text-white text-xs font-semibold uppercase tracking-wider transition-all shadow-sm"
            >
              Sign In / Register
            </Link>
            <button
              onClick={() => setFormOpen(false)}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-stone-300 hover:bg-stone-100 text-stone-600 text-xs font-semibold uppercase tracking-wider transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {formOpen && isAuthenticated && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-md animate-scale-up space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-stone-100">
            <div>
              <h3 className="text-lg font-bold text-[#141b28]">Share Your Honest Feedback</h3>
              <p className="text-xs text-stone-500">
                Help fellow customers make informed, conscious choices.
              </p>
            </div>
            <button
              onClick={() => setFormOpen(false)}
              className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 hover:text-stone-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Star Rating Picker */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-2">
                Overall Rating <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                <div 
                  className="flex items-center gap-1"
                  onMouseLeave={() => setHoverRating(0)}
                >
                  {[1, 2, 3, 4, 5].map((s) => {
                    const active = (hoverRating || form.rating) >= s;
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setForm((prev) => ({ ...prev, rating: s }))}
                        onMouseEnter={() => setHoverRating(s)}
                        className="p-1 transition-transform hover:scale-110 focus:outline-none"
                      >
                        <Star
                          className={`w-7 h-7 transition-colors ${
                            active ? "fill-[#997b47] text-[#997b47]" : "text-stone-200 hover:text-stone-300"
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
                <span className="text-xs font-semibold text-[#997b47] ml-2">
                  {RATING_LABELS[hoverRating || form.rating]}
                </span>
              </div>
            </div>

            {/* Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Your Display Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pratibha Avhad"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-[#41542f] focus:ring-1 focus:ring-[#41542f]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5 flex items-center justify-between">
                  <span>Verified Email</span>
                  <span className="text-[10px] text-[#41542f] font-normal flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-[#41542f]" /> Account Verified
                  </span>
                </label>
                <input
                  type="email"
                  disabled
                  value={user?.email || form.email}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-600 text-sm cursor-not-allowed"
                />
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Review Headline (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Perfect fit, sublime organic texture!"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-[#41542f] focus:ring-1 focus:ring-[#41542f]"
              />
            </div>

            {/* Message Body */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Detailed Review <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={4}
                placeholder="Describe the fabric feel, drape, sizing accuracy, and overall craftsmanship..."
                value={form.body}
                onChange={(e) => setForm({ ...form, body: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-[#41542f] focus:ring-1 focus:ring-[#41542f]"
              />
            </div>

            {/* Customer Photo Upload */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Attach Customer Photos (Optional, max 4)
              </label>
              
              <div className="flex flex-wrap items-center gap-3">
                {images.map((img, idx) => (
                  <div key={idx} className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-stone-200 shadow-soft-sm group">
                    <img src={img} alt="Customer upload" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removePhoto(idx)}
                      className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center opacity-90 hover:opacity-100"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}

                {images.length < 4 && (
                  <label className="w-20 h-20 rounded-2xl border-2 border-dashed border-stone-300 hover:border-[#41542f] bg-stone-50 hover:bg-stone-100 flex flex-col items-center justify-center cursor-pointer transition-colors text-stone-500 hover:text-[#41542f]">
                    <Camera className="w-5 h-5 mb-1" />
                    <span className="text-[10px] font-semibold">Add Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handlePhotoSelect}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              <p className="text-[11px] text-stone-400 mt-1.5">
                Upload real photos of you wearing or styling the piece (JPG, PNG, WebP up to 5MB).
              </p>
            </div>

            {/* Moderation / Visibility Policy Note */}
            <div className="bg-amber-50/70 border border-amber-200/60 rounded-2xl p-4 text-xs text-amber-900 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-950">Dynamic Visibility System:</p>
                <p className="text-stone-600 mt-0.5 leading-relaxed">
                  {isAuthenticated() ? (
                    <>
                      Since you are logged in as <strong>{user?.name || user?.email}</strong>, this review will 
                      <strong> always be visible to you</strong> immediately. Once approved by our team, it will appear publicly to all customers.
                    </>
                  ) : (
                    <>
                      Reviews are moderated by our team to maintain an authentic community before appearing publicly.
                    </>
                  )}
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setFormOpen(false)}
                className="px-5 py-2.5 rounded-xl border border-stone-200 text-xs font-semibold text-stone-600 hover:bg-stone-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 rounded-xl bg-[#41542f] hover:bg-[#344326] text-white text-xs font-bold uppercase tracking-wider shadow-soft-sm transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {submitting ? "Submitting Review..." : "Submit Review"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── Customer Photos Showcase Strip ── */}
      {allCustomerPhotos.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-[#141b28] flex items-center gap-2">
              <Camera className="w-4 h-4 text-[#997b47]" />
              Customer Photos ({allCustomerPhotos.length})
            </h4>
            <span className="text-xs text-stone-400">Click photo to view full size</span>
          </div>

          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin">
            {allCustomerPhotos.map((item, idx) => (
              <div
                key={idx}
                onClick={() => setLightboxImage(item.img)}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shrink-0 border-2 border-stone-200 hover:border-[#997b47] cursor-pointer shadow-soft-sm transition-all hover:scale-105 relative group"
              >
                <img
                  src={getImageUrl(item.img)}
                  alt="Customer styling"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                  <span className="text-[10px] text-white font-medium truncate">{item.author}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Filters & Search Strip ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-stone-200">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-semibold text-stone-500 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </span>
          <button
            onClick={() => setActiveRatingFilter("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
              activeRatingFilter === "all"
                ? "bg-[#41542f] text-white border-[#41542f]"
                : "bg-white text-stone-600 border-stone-200 hover:border-stone-300"
            }`}
          >
            All Reviews ({reviews.length})
          </button>
          {[5, 4, 3, 2, 1].map((s) => (
            <button
              key={s}
              onClick={() => setActiveRatingFilter(String(s))}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors flex items-center gap-1 ${
                activeRatingFilter === String(s)
                  ? "bg-[#41542f] text-white border-[#41542f]"
                  : "bg-white text-stone-600 border-stone-200 hover:border-stone-300"
              }`}
            >
              {s} <Star className="w-3 h-3 fill-current" />
            </button>
          ))}
          {allCustomerPhotos.length > 0 && (
            <button
              onClick={() => setWithPhotosOnly(!withPhotosOnly)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors flex items-center gap-1 ${
                withPhotosOnly
                  ? "bg-[#997b47] text-white border-[#997b47]"
                  : "bg-white text-stone-600 border-stone-200 hover:border-stone-300"
              }`}
            >
              <Camera className="w-3 h-3" /> With Photos
            </button>
          )}
        </div>

        <span className="text-xs text-stone-500">
          Showing <strong>{filteredReviews.length}</strong> of {reviews.length} reviews
        </span>
      </div>

      {/* ── Reviews Cards List ── */}
      {loading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-4 border-[#997b47] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-stone-400 mt-2">Loading verified reviews...</p>
        </div>
      ) : filteredReviews.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-3xl border border-stone-200/80 p-8">
          <MessageSquare className="w-10 h-10 text-stone-300 mx-auto mb-2" />
          <p className="text-sm font-semibold text-stone-700">No reviews found</p>
          <p className="text-xs text-stone-400 mt-1 max-w-sm mx-auto">
            {activeRatingFilter !== "all" || withPhotosOnly
              ? "No reviews match the selected filter. Try clearing your filters."
              : "Be the first to share your experience with this handcrafted piece!"}
          </p>
          {!formOpen && (
            <button
              onClick={() => setFormOpen(true)}
              className="mt-4 px-5 py-2.5 rounded-xl bg-[#997b47] text-white text-xs font-semibold hover:bg-[#836838] transition-colors"
            >
              Write First Review
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReviews.map((rev) => (
            <ReviewCard
              key={rev.id}
              review={rev}
              onHelpful={handleHelpful}
              onImageClick={(img) => setLightboxImage(img)}
            />
          ))}
        </div>
      )}

      {/* ── Lightbox Modal ── */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
          onClick={() => setLightboxImage(null)}
        >
          <div
            className="relative max-w-3xl max-h-[85vh] overflow-hidden rounded-3xl bg-black border border-stone-700 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center border border-white/20 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={getImageUrl(lightboxImage)}
              alt="Review Photo Fullscreen"
              className="max-h-[80vh] w-auto object-contain mx-auto"
            />
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Individual Review Card Component with Read More & Photos ──────────────── */
function ReviewCard({ review, onHelpful, onImageClick }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = (review.body || "").length > 180;
  const isOwn = Boolean(review.is_own_review);
  const isPending = review.status === "pending";

  const initial = (review.name || review.author || "A")[0]?.toUpperCase();
  const dateFormatted = review.created_at || review.date
    ? new Date(review.created_at || review.date).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "";

  return (
    <article
      className={`rounded-2xl p-5 sm:p-6 border transition-all ${
        isOwn && isPending
          ? "bg-amber-50/40 border-amber-200/80 shadow-soft-sm"
          : "bg-white border-stone-200/70 hover:border-stone-300 shadow-soft-sm"
      }`}
    >
      {/* Header: User avatar + Author + Badges + Date */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#FAF8F5] border border-stone-200 text-[#41542f] font-serif font-bold text-base flex items-center justify-center shadow-soft-sm">
            {initial}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h5 className="text-sm font-bold text-[#141b28]">
                {review.name || review.author || "Customer"}
              </h5>

              {/* Verified Buyer Badge */}
              {review.verified && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                  <CheckCircle className="w-3 h-3" />
                  Verified Buyer
                </span>
              )}

              {/* Own Review / Status Badge */}
              {isOwn && (
                <span
                  className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
                    isPending
                      ? "bg-amber-100 text-amber-800 border-amber-300"
                      : "bg-emerald-100 text-emerald-800 border-emerald-300"
                  }`}
                >
                  <Clock className="w-3 h-3" />
                  {isPending ? "Your Review (Pending Moderation)" : "Your Review (Published)"}
                </span>
              )}
            </div>

            {/* Stars & Rating */}
            <div className="flex items-center gap-1.5 mt-1">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-3.5 h-3.5 ${
                      Number(review.rating) >= star
                        ? "fill-[#997b47] text-[#997b47]"
                        : "text-stone-200"
                    }`}
                  />
                ))}
              </div>
              <span className="text-[11px] font-semibold text-[#997b47]">
                {RATING_LABELS[review.rating] || `${review.rating} Stars`}
              </span>
            </div>
          </div>
        </div>

        {/* Date */}
        <span className="text-xs text-stone-400 font-medium">
          {dateFormatted}
        </span>
      </div>

      {/* Review Title */}
      {review.title && (
        <h6 className="text-sm font-bold text-[#141b28] mb-1.5">
          {review.title}
        </h6>
      )}

      {/* Review Body (with Read More / Read Less) */}
      <div className="text-xs sm:text-sm text-stone-600 leading-relaxed">
        <p className="inline">
          {isLong && !expanded ? `${review.body.slice(0, 180)}...` : review.body}
        </p>
        {isLong && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="ml-2 text-xs font-semibold text-[#997b47] hover:underline inline-flex items-center gap-0.5"
          >
            {expanded ? "Read less" : "Read more"}
            {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        )}
      </div>

      {/* Review Photos (if any) */}
      {review.images && Array.isArray(review.images) && review.images.length > 0 && (
        <div className="mt-4 pt-3 border-t border-stone-100">
          <div className="flex items-center gap-2.5 flex-wrap">
            {review.images.map((img, idx) => (
              <div
                key={idx}
                onClick={() => onImageClick(img)}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border border-stone-200 hover:border-[#997b47] cursor-pointer shadow-soft-sm transition-transform hover:scale-105"
              >
                <img
                  src={getImageUrl(img)}
                  alt={`Review photo ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Footer: Helpful Vote */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-stone-100 text-xs">
        <span className="text-[11px] text-stone-400">
          Was this review helpful?
        </span>

        <button
          onClick={() => onHelpful(review.id)}
          disabled={review.has_voted}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border transition-colors ${
            review.has_voted
              ? "bg-stone-100 text-stone-400 border-stone-200 cursor-default"
              : "bg-white text-stone-600 border-stone-200 hover:border-[#41542f] hover:text-[#41542f]"
          }`}
        >
          <ThumbsUp className="w-3.5 h-3.5" />
          <span>Helpful ({review.likes_count || 0})</span>
        </button>
      </div>
    </article>
  );
}
