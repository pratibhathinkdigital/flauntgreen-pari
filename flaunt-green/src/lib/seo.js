export async function getSeoMetadata(route) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    const res = await fetch(`${apiUrl}/api/seo?route=${encodeURIComponent(route)}`, {
      next: { revalidate: 3600 } // cache for 1 hour
    });
    if (!res.ok) return {};
    
    const seo = await res.json();
    
    const metadata = {};
    if (seo.title) metadata.title = seo.title;
    if (seo.description) metadata.description = seo.description;
    if (seo.keywords) metadata.keywords = seo.keywords;
    if (seo.og_image) {
      metadata.openGraph = {
        images: [{ url: seo.og_image }],
      };
    }
    
    return metadata;
  } catch (error) {
    console.error(`Failed to fetch SEO for ${route}:`, error);
    return {};
  }
}
