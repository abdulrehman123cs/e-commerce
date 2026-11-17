const SITE_NAME = "Riaz Toye Center";
const DEFAULT_DESCRIPTION =
  "Shop toys, perfume, and everyday gifts at Riaz Toye Center. Safe toys, long-lasting scents, and family-friendly prices with easy online ordering.";
const DEFAULT_KEYWORDS =
  "Riaz Toye Center, toys, perfume, kids toys, online toy store, gift shop, building blocks, stuffed toys";

function upsertMeta(attr, key, content) {
  if (!content) return;
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertLink(rel, href) {
  if (!href) return;
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!rel.includes("alternate")) {
    // keep single canonical/etc
  }
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

function upsertJsonLd(id, data) {
  let el = document.getElementById(id);
  if (!data) {
    if (el) el.remove();
    return;
  }
  if (!el) {
    el = document.createElement("script");
    el.type = "application/ld+json";
    el.id = id;
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

export function applySeo({
  title,
  description = DEFAULT_DESCRIPTION,
  keywords = DEFAULT_KEYWORDS,
  path = "/",
  image = "/uploads/hero-toys.jpg",
  type = "website",
  noindex = false,
  jsonLd,
} = {}) {
  const origin = window.location.origin;
  const url = `${origin}${path.startsWith("/") ? path : `/${path}`}`;
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — Toys, Perfume & Gifts`;
  const imageUrl = image.startsWith("http") ? image : `${origin}${image}`;

  document.title = fullTitle;

  upsertMeta("name", "description", description);
  upsertMeta("name", "keywords", keywords);
  upsertMeta("name", "author", SITE_NAME);
  upsertMeta("name", "robots", noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large");
  upsertMeta("name", "theme-color", "#ff2d55");

  upsertMeta("property", "og:site_name", SITE_NAME);
  upsertMeta("property", "og:title", fullTitle);
  upsertMeta("property", "og:description", description);
  upsertMeta("property", "og:type", type);
  upsertMeta("property", "og:url", url);
  upsertMeta("property", "og:image", imageUrl);
  upsertMeta("property", "og:locale", "en_PK");

  upsertMeta("name", "twitter:card", "summary_large_image");
  upsertMeta("name", "twitter:title", fullTitle);
  upsertMeta("name", "twitter:description", description);
  upsertMeta("name", "twitter:image", imageUrl);

  upsertLink("canonical", url);
  upsertJsonLd("seo-jsonld", jsonLd);
}

export function storeJsonLd() {
  const origin = window.location.origin;
  return {
    "@context": "https://schema.org",
    "@type": "Store",
    name: SITE_NAME,
    url: origin,
    description: DEFAULT_DESCRIPTION,
    image: `${origin}/uploads/hero-toys.jpg`,
    priceRange: "Rs",
    makesOffer: {
      "@type": "Offer",
      itemOffered: {
        "@type": "Product",
        name: "Toys, perfume and gifts",
      },
    },
  };
}

export function productJsonLd(product) {
  if (!product) return null;
  const origin = window.location.origin;
  const image = product.image
    ? product.image.startsWith("http")
      ? product.image
      : `${origin}${product.image}`
    : `${origin}/uploads/hero-toys.jpg`;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description || `${product.name} at ${SITE_NAME}`,
    image,
    sku: product.id,
    category: product.category,
    brand: {
      "@type": "Brand",
      name: SITE_NAME,
    },
    offers: {
      "@type": "Offer",
      url: `${origin}/product/${product.id}`,
      priceCurrency: "PKR",
      price: String(product.price ?? 0),
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: SITE_NAME,
      },
    },
  };
}

export { SITE_NAME, DEFAULT_DESCRIPTION };
