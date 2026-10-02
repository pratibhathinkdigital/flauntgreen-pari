export default function MegaMenu({ onClose }) {
  const categories = [
    { name: "Organic Food",    href: "/categories/organic-food",    emoji: "🌾" },
    { name: "Eco Home",        href: "/categories/eco-home",        emoji: "🏡" },
    { name: "Sustainable Fashion", href: "/categories/fashion",     emoji: "👗" },
    { name: "Natural Beauty",  href: "/categories/beauty",          emoji: "✨" },
    { name: "Zero Waste",      href: "/categories/zero-waste",      emoji: "♻️" },
    { name: "Garden",          href: "/categories/garden",          emoji: "🌱" },
  ];

  return (
    <div
      className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[min(24rem,calc(100vw-2rem))] card p-4 animate-slide-down"
      onMouseLeave={onClose}
    >
      <p className="text-2xs text-text-muted font-semibold uppercase tracking-wider mb-3">
        Browse Categories
      </p>
      <div className="grid grid-cols-2 gap-1.5">
        {categories.map((cat) => (
          <a
            key={cat.name}
            href={cat.href}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-brand-50 transition-colors text-sm font-medium text-text-secondary hover:text-brand-700"
          >
            <span className="text-lg">{cat.emoji}</span>
            {cat.name}
          </a>
        ))}
      </div>
    </div>
  );
}
