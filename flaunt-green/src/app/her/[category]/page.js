"use client";
import { useRef, useState, useEffect, useCallback, use } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import NewsletterSection from '@/components/sections/NewsletterSection';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { productsApi } from '@/services/api';
import { getImageUrl } from '@/lib/axios';

const CARD_GAP = 20;
const SCROLL_AMOUNT = 220 + CARD_GAP;
const VISIBLE_COUNT = 5;

function formatPrice(price) {
  return `₹${price.toLocaleString("en-IN")}.00/-`;
}

function matchesCategory(p, targetSlug) {
  if (!targetSlug) return false;
  const target = targetSlug.toLowerCase().trim();
  const isEkam = p.collection?.slug?.toLowerCase().includes('ekam') || p.collection?.name?.toLowerCase().includes('ekam');
  const catName = (p.category?.name || '').toLowerCase().trim();
  const catSlugDb = (p.category?.slug || '').toLowerCase().trim();

  if (target === 'topwear') {
    if (isEkam) return true;
    return catName.includes('topwear') || catSlugDb.includes('topwear') || catName.includes('shirt') || catName.includes('top') || catName.includes('tee') || catName.includes('kurta');
  }
  if (target === 'bottomwear') {
    return catName.includes('bottomwear') || catSlugDb.includes('bottomwear') || catName.includes('trouser') || catName.includes('pant') || catName.includes('skirt') || catName.includes('short') || catName.includes('chinos');
  }
  if (target === 'dresses') {
    return catName.includes('dress') || catSlugDb.includes('dress') || catName.includes('gown');
  }
  if (target === 'outerwear') {
    return catName.includes('outerwear') || catSlugDb.includes('outerwear') || catName.includes('jacket') || catName.includes('coat') || catName.includes('blazer') || catName.includes('shacket') || catName.includes('bandi');
  }
  if (target === 'accessories') {
    return catName.includes('accessories') || catSlugDb.includes('accessories') || catName.includes('scarf') || catName.includes('belt') || catName.includes('bag') || catName.includes('cap') || catName.includes('tie');
  }

  // General slug / name match
  const cleanTarget = target.replace(/[-_]/g, ' ');
  return (
    catSlugDb === target ||
    catSlugDb.startsWith(target) ||
    target.startsWith(catSlugDb) ||
    catName === cleanTarget ||
    catName.includes(cleanTarget) ||
    cleanTarget.includes(catName)
  );
}

function CategoryRow({ cat }) {
  const scrollRef = useRef(null);
  const [showArrows, setShowArrows] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const needsScroll = cat.products.length > VISIBLE_COUNT;
    setShowArrows(needsScroll);
    setCanScrollLeft(el.scrollLeft > 2);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 2);
  }, [cat.products.length]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener('scroll', checkScroll, { passive: true });
    window.addEventListener('resize', checkScroll);
    return () => {
      el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [checkScroll]);

  const scroll = (direction) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: direction === 'right' ? SCROLL_AMOUNT : -SCROLL_AMOUNT, behavior: 'smooth' });
  };

  return (
    <section className="py-12 bg-white">
      <div className="mx-auto px-4" style={{ maxWidth: "1260px" }}>
        <div className="mb-6" style={{ marginTop: '40px', marginBottom: '20px' }}>
          <Link href={`/her/${cat.slug}`} className="group inline-block">
            <h2
              className="font-heading font-bold leading-tight mb-4 text-left group-hover:text-[#997b47] transition-colors"
              style={{ fontSize: "clamp(24px, 3vw, 36px)", color: "#1C2A3A" }}
            >
              {cat.name.toUpperCase()}
            </h2>
          </Link>
          <div className="h-px bg-gray-300 mt-2" />
        </div>

        <div style={{ position: 'relative' }}>
          {showArrows && canScrollLeft && (
            <button
              onClick={() => scroll('left')}
              aria-label="Scroll left"
              style={{
                position: 'absolute', left: '-16px', top: '50%', transform: 'translateY(-50%)',
                zIndex: 10, width: '32px', height: '32px', borderRadius: '50%',
                backgroundColor: '#fff', border: '1px solid #ccc', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
              }}
            >
              ‹
            </button>
          )}

          <div
            ref={scrollRef}
            style={{
              display: 'flex', gap: `${CARD_GAP}px`, overflowX: 'auto', flexWrap: 'nowrap',
              scrollbarWidth: 'none', msOverflowStyle: 'none',
            }}
          >
            <style>{`.her-dyn-scroll::-webkit-scrollbar { display: none; }`}</style>
            {cat.products.map((product) => (
              <Link
                key={product._id}
                href={`/products/${product.slug}?path=her/${cat.slug}`}
                className="her-dyn-scroll block bg-white overflow-hidden rounded-xl group shadow-sm"
                style={{ flex: '0 0 220px' }}
              >
                <div className="relative w-full overflow-hidden rounded-t-xl" style={{ aspectRatio: "3 / 4" }}>
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="px-4 py-4">
                  <p
                    className="uppercase font-semibold tracking-[0.08em]"
                    style={{ fontFamily: "var(--font-heading), 'Cormorant Garamond', serif", fontSize: "15px", color: "#2B2B2B" }}
                  >
                    {product.name}
                  </p>
                  {product.subtitle && (
                    <p className="text-xs text-gray-500 mt-0.5">{product.subtitle}</p>
                  )}
                  <p
                    className="font-bold mt-1"
                    style={{ fontSize: "15px", color: "#2B2B2B" }}
                  >
                    {formatPrice(product.price)}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {showArrows && canScrollRight && (
            <button
              onClick={() => scroll('right')}
              aria-label="Scroll right"
              style={{
                position: 'absolute', right: '-16px', top: '50%', transform: 'translateY(-50%)',
                zIndex: 10, width: '32px', height: '32px', borderRadius: '50%',
                backgroundColor: '#fff', border: '1px solid #ccc', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
              }}
            >
              ›
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

export default function HerCategoryDynamicPage() {
  const params = useParams();
  const categorySlug = (params?.category || '').toString();

  const [productsList, setProductsList] = useState([]);
  const [relatedList, setRelatedList] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!categorySlug) return;

    productsApi.getAll({ section: 'her' })
      .then((res) => {
        if (res.data && res.data.length > 0) {
          const mapped = res.data.map((p) => ({
            _id: p.id,
            slug: p.slug,
            name: p.name,
            subtitle: p.name?.includes('Tee') ? `${p.name.replace(' Tee', '')} Philosophy` : undefined,
            price: Number(p.price),
            images: [getImageUrl(p.primary_image?.image_url || p.images?.[0]?.image_url, '/placeholder.png')],
            raw: p,
          }));

          // Products for this category
          const categoryProducts = mapped.filter((p) => matchesCategory(p.raw, categorySlug));
          setProductsList(categoryProducts);

          // Find display title
          if (categoryProducts.length > 0 && categoryProducts[0].raw.category?.name) {
            setCategoryName(categoryProducts[0].raw.category.name);
          } else {
            const formatted = categorySlug
              .split(/[-_]/)
              .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
              .join(' ');
            setCategoryName(formatted);
          }

          // Related categories (other categories with products)
          const allCategoriesMap = {};
          mapped.forEach((p) => {
            const cat = p.raw.category;
            if (!cat) return;
            const cSlug = cat.slug || 'category';
            if (matchesCategory(p.raw, categorySlug)) return; // skip current
            if (!allCategoriesMap[cSlug]) {
              allCategoriesMap[cSlug] = {
                name: cat.name || cSlug,
                slug: cSlug,
                products: [],
              };
            }
            allCategoriesMap[cSlug].products.push(p);
          });

          setRelatedList(Object.values(allCategoriesMap));
        } else {
          setProductsList([]);
          setRelatedList([]);
          setCategoryName(
            categorySlug
              .split(/[-_]/)
              .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
              .join(' ')
          );
        }
      })
      .catch(() => {
        setProductsList([]);
        setRelatedList([]);
      })
      .finally(() => setLoading(false));
  }, [categorySlug]);

  const displayTitle = categoryName || categorySlug.replace(/[-_]/g, ' ');

  return (
    <div>
      <Header />

      {/* Page Title */}
      <section style={{ backgroundColor: "#ffffff", paddingTop: "30px", paddingBottom: "15px", textAlign: "center" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", paddingLeft: "20px", paddingRight: "20px" }}>
          <h1
            className="font-heading font-normal leading-tight capitalize"
            style={{ fontSize: "clamp(24px, 3vw, 36px)", color: "#1C2A3A", marginBottom: "10px" }}
          >
            {displayTitle}
          </h1>
          <div style={{ maxWidth: "600px", margin: "0 auto" }}>
            <div className="h-px bg-gray-300 mt-2" />
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section style={{ backgroundColor: "#ffffff", paddingBottom: "60px" }}>
        <div className="mx-auto px-4" style={{ maxWidth: "1260px" }}>
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#997b47]"></div>
            </div>
          ) : productsList.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <p className="font-heading text-2xl mb-2" style={{ color: "#1C2A3A" }}>No products found in {displayTitle}</p>
              <p className="text-sm text-gray-400">Check back soon for new arrivals.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {productsList.map((product) => (
                <Link
                  key={product._id}
                  href={`/products/${product.slug}?path=her/${categorySlug}`}
                  className="block bg-white overflow-hidden rounded-xl group shadow-sm"
                >
                  <div className="relative w-full overflow-hidden rounded-t-xl" style={{ aspectRatio: "3 / 4" }}>
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="px-4 py-4 md:px-5 md:py-5">
                    <p
                      className="uppercase font-semibold tracking-[0.08em]"
                      style={{ fontFamily: "var(--font-heading), 'Cormorant Garamond', serif", fontSize: "15px", color: "#2B2B2B" }}
                    >
                      {product.name}
                    </p>
                    {product.subtitle && (
                      <p className="text-xs text-gray-500 mt-0.5">{product.subtitle}</p>
                    )}
                    <p
                      className="font-bold mt-1"
                      style={{ fontSize: "15px", color: "#2B2B2B" }}
                    >
                      {formatPrice(product.price)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Related Categories */}
      {relatedList.length > 0 && (
        <>
          <section className="py-8 bg-white">
            <div className="mx-auto px-4" style={{ maxWidth: "1260px" }}>
              <h2
                className="font-heading font-bold leading-tight text-center mb-2"
                style={{ fontSize: "clamp(28px, 3.5vw, 42px)", color: "#1C2A3A" }}
              >
                Related Categories
              </h2>
            </div>
          </section>

          {relatedList.map((cat) => (
            <CategoryRow key={cat.slug} cat={cat} />
          ))}
        </>
      )}

      <NewsletterSection />
      <Footer />
    </div>
  );
}
