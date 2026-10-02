import ProductCard from "@/components/ui/ProductCard";

export default function ProductGrid({ products = [], isLoading = false, columns = 4 }) {
  const colClass = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
  }[columns];

  if (isLoading) {
    return (
      <div className={`grid ${colClass} gap-4 lg:gap-6`}>
        {Array.from({ length: columns * 2 }).map((_, i) => (
          <div key={i} className="card overflow-hidden">
            <div className="skeleton aspect-square" />
            <div className="p-4 space-y-2">
              <div className="skeleton h-3 rounded w-1/3" />
              <div className="skeleton h-4 rounded w-3/4" />
              <div className="skeleton h-3 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!Array.isArray(products) || products.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-text-muted text-lg">No products found.</p>
      </div>
    );
  }

  return (
    <div className={`grid ${colClass} gap-4 lg:gap-6`}>
      {Array.isArray(products) && products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}
