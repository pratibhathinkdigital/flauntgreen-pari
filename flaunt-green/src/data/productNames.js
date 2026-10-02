// Human-readable product names keyed by slug — shared by admin tooling.
import { PRODUCT_SLUGS } from "@/data/productSlugs";

export const PRODUCT_NAMES = {
  // ── Her ──
  "triangle-dress": "Triangle Dress",
  "pheran-dress": "Pheran Dress",
  "icicle-trousers": "Icicle Trousers",
  "flared-pants": "Flared Pants",
  "two-way-skirt": "Two Way Skirt",
  "cowl-top-1": "Cowl Top",
  "cowl-top-2": "Cowl Top",
  "pheran-necktie-top": "Pheran Necktie Top",
  "stormguard-top": "Stormguard Top",
  "asymmetric-stupa-shirt": "Asymmetric Stupa Shirt",
  "reversible-shacket-1": "Reversible Shacket",
  "khadi-blazer": "Khadi Blazer",
  "notched-stormguard-coat": "Notched Stormguard Coat",
  "reversible-shacket-2": "Reversible Shacket",
  "womens-scarf": "Women's Scarf",
  "empathy-tee": "Empathy Tee",
  "karma-tee": "Karma Tee",
  "ahimsa-tee": "Ahimsa Tee",
  "moksha-tee": "Moksha Tee",
  // ── Him ──
  "cotton-kurta": "Cotton Kurta",
  "linen-shirt": "Linen Shirt",
  "henley-tee": "Henley Tee",
  "oversized-tee": "Oversized Tee",
  "camp-collar-shirt": "Camp Collar Shirt",
  "relaxed-trousers": "Relaxed Trousers",
  chinos: "Chinos",
  "drawstring-shorts": "Drawstring Shorts",
  "structured-blazer": "Structured Blazer",
  "quilted-jacket": "Quilted Jacket",
  windbreaker: "Windbreaker",
  overcoat: "Overcoat",
  "mens-scarf": "Men's Scarf",
  "canvas-belt": "Canvas Belt",
  "tote-bag": "Tote Bag",
  cap: "Cap",
  "pocket-square": "Pocket Square",
  cufflinks: "Cufflinks",
  // ── Dog Togs ──
  "skippers-shirt": "Skippers Shirt",
  "hatch-coat": "Hatch Coat",
  "sailors-shirt": "Sailors Shirt",
  "high-tide-coat": "High Tide Coat",
  "reversible-lehenga-dress": "Reversible Lehenga Dress",
  "reversible-bandhgala": "Reversible Bandhgala",
};

export const ADMIN_PRODUCT_OPTIONS = PRODUCT_SLUGS.map((slug) => ({
  slug,
  name: PRODUCT_NAMES[slug] || slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
}));