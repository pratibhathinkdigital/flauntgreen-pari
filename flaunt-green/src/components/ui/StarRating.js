import { Star } from "lucide-react";

export default function StarRating({ rating = 0, count = 0, size = "sm" }) {
  const sizes = { sm: "w-3.5 h-3.5", md: "w-4 h-4", lg: "w-5 h-5" };
  const s = sizes[size];

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${s} ${star <= Math.round(rating) ? "star-filled fill-current" : "star-empty"}`}
          />
        ))}
      </div>
      {count > 0 && (
        <span className="text-xs text-text-muted">({count.toLocaleString()})</span>
      )}
    </div>
  );
}
