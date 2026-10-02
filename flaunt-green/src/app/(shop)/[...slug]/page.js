export const dynamicParams = false;

export function generateStaticParams() {
  return [
    { slug: ["shop"] },
    { slug: ["shop", "her"] },
    { slug: ["shop", "her", "topwear"] },
    { slug: ["shop", "her", "bottomwear"] },
    { slug: ["shop", "him"] },
    { slug: ["shop", "him", "topwear"] },
    { slug: ["shop", "accessories"] },
    { slug: ["shop", "dog-togs"] },
    { slug: ["dog-togs"] },
    { slug: ["dog-togs", "festive-wear"] },
    { slug: ["dog-togs", "pawsails"] },
    { slug: ["dog-togs", "best-seller-1"] },
    { slug: ["dog-togs", "best-seller-2"] },
    { slug: ["dog-togs", "best-seller-3"] },
    { slug: ["dog-togs", "best-seller-4"] },
    { slug: ["new"] },
    { slug: ["blog"] },
    { slug: ["sustainability"] },
    { slug: ["location"] },
  ];
}

export default async function DynamicPage({ params }) {
  const { slug } = await params;
  const title = slug.join(" / ");

  return (
    <main>
      <h1>{title}</h1>
    </main>
  );
}