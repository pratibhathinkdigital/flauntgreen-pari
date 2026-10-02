// Live per-size stock levels for the Product Detail Page.
// A size with 0 stock is disabled and shown as out of stock.

const DEFAULT_STOCK = { XS: 2, S: 3, M: 3, L: 3, XL: 2, XXL: 1 };

const INVENTORY = {
  // ── Her ──
  "triangle-dress":            { S: 2, M: 2, L: 2, XL: 0, XXL: 0 },
  "pheran-dress":              { S: 1, M: 2, L: 2, XL: 0 },
  "icicle-trousers":           { S: 0, M: 2, L: 2, XL: 1, XXL: 1 },
  "flared-pants":              { S: 3, M: 2, L: 0, XL: 1 },
  "two-way-skirt":             { S: 1, M: 1, L: 2, XL: 1 },
  "cowl-top-1":                { S: 2, M: 3, L: 2, XL: 1, XXL: 0 },
  "cowl-top-2":                { S: 3, M: 3, L: 1, XL: 1 },
  "pheran-necktie-top":        { S: 2, M: 2, L: 0, XL: 1 },
  "stormguard-top":            { S: 1, M: 2, L: 2, XL: 2 },
  "asymmetric-stupa-shirt":    { S: 2, M: 2, L: 1, XL: 0, XXL: 1 },
  "reversible-shacket-1":      { S: 1, M: 1, L: 1, XL: 1 },
  "khadi-blazer":              { S: 0, M: 2, L: 2, XL: 1 },
  "notched-stormguard-coat":   { M: 2, L: 1, XL: 1 },
  "reversible-shacket-2":      { S: 2, M: 1, L: 0, XL: 1 },
  "womens-scarf":              { ONE: 6, S: 6, M: 6, L: 6, XL: 6, XXL: 6 },
  "empathy-tee":               { S: 4, M: 5, L: 4, XL: 3, XXL: 2 },
  "karma-tee":                 { S: 4, M: 5, L: 4, XL: 3, XXL: 2 },
  "ahimsa-tee":                { S: 4, M: 5, L: 4, XL: 3, XXL: 2 },
  "moksha-tee":                { S: 5, M: 5, L: 4, XL: 3, XXL: 2 },
  // ── Him ──
  "cotton-kurta":              { S: 3, M: 4, L: 4, XL: 3, XXL: 2 },
  "linen-shirt":               { S: 2, M: 3, L: 3, XL: 2, XXL: 2 },
  "henley-tee":                { S: 3, M: 4, L: 3, XL: 2, XXL: 1 },
  "oversized-tee":             { S: 4, M: 4, L: 3, XL: 2, XXL: 1 },
  "camp-collar-shirt":         { S: 2, M: 3, L: 3, XL: 2, XXL: 2 },
  "relaxed-trousers":          { S: 2, M: 3, L: 2, XL: 2, XXL: 0 },
  "chinos":                    { S: 3, M: 3, L: 2, XL: 2, XXL: 2 },
  "drawstring-shorts":         { S: 3, M: 4, L: 3, XL: 2, XXL: 2 },
  "structured-blazer":         { S: 1, M: 2, L: 2, XL: 1 },
  "quilted-jacket":            { S: 2, M: 2, L: 1, XL: 1 },
  "windbreaker":               { S: 2, M: 2, L: 2, XL: 1 },
  "overcoat":                  { S: 1, M: 1, L: 1, XL: 1 },
  "mens-scarf":                { ONE: 8, S: 8, M: 8, L: 8, XL: 8, XXL: 8 },
  "canvas-belt":               { ONE: 5, S: 5, M: 5, L: 5, XL: 5, XXL: 5 },
  "tote-bag":                  { ONE: 4, S: 4, M: 4, L: 4, XL: 4, XXL: 4 },
  "cap":                       { ONE: 6, S: 6, M: 6, L: 6, XL: 6, XXL: 6 },
  "pocket-square":             { ONE: 7, S: 7, M: 7, L: 7, XL: 7, XXL: 7 },
  "cufflinks":                 { ONE: 3, S: 3, M: 3, L: 3, XL: 3, XXL: 3 },
  // ── Dog Togs ──
  "skippers-shirt":            { XS: 3, S: 4, M: 3, L: 2, XL: 1 },
  "hatch-coat":                { XS: 2, S: 3, M: 2, L: 2, XL: 0 },
  "sailors-shirt":             { XS: 3, S: 4, M: 3, L: 2, XL: 1 },
  "high-tide-coat":            { XS: 2, S: 2, M: 2, L: 1, XL: 1 },
  "reversible-lehenga-dress":  { XS: 2, S: 3, M: 2, L: 2, XL: 1 },
  "reversible-bandhgala":      { XS: 2, S: 3, M: 2, L: 2, XL: 1 },
};

/**
 * Return stock counts keyed by size for a product.
 * Falls back to DEFAULT_STOCK for any size not explicitly listed.
 */
export function getInventoryForSlug(slug, sizes = []) {
  const explicit = INVENTORY[slug] || {};
  const stock = {};
  sizes.forEach((size) => {
    stock[size] = explicit[size] !== undefined ? explicit[size] : DEFAULT_STOCK[size] || 0;
  });
  return stock;
}

export function getStockForSize(slug, size) {
  const explicit = INVENTORY[slug] || {};
  if (explicit[size] !== undefined) return explicit[size];
  return DEFAULT_STOCK[size] !== undefined ? DEFAULT_STOCK[size] : 0;
}