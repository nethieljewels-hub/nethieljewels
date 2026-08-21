import JsonLd from "./JsonLd";
import { getSiteUrl, generateCategorySeoDescription } from "@/utils/seo";

interface CollectionProductItem {
  id: string;
  title: string;
  slug: string;
  images: string[];
}

interface CollectionJsonLdProps {
  category: {
    name: string;
    slug: string;
    seo_description?: string | null;
  };
  products?: CollectionProductItem[];
}

export default function CollectionJsonLd({ category, products = [] }: CollectionJsonLdProps) {
  const baseUrl = getSiteUrl();
  const collectionUrl = `${baseUrl}/collections/${category.slug}`;

  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${collectionUrl}#collection`,
    url: collectionUrl,
    name: `${category.name} Collection`,
    description: generateCategorySeoDescription(category),
    ...(products.length > 0
      ? {
          mainEntity: {
            "@type": "ItemList",
            numberOfItems: products.length,
            itemListElement: products.map((item, index) => ({
              "@type": "ListItem",
              position: index + 1,
              url: `${baseUrl}/products/${item.slug}`,
              name: item.title,
              ...(item.images && item.images[0] ? { image: item.images[0] } : {}),
            })),
          },
        }
      : {}),
  };

  return <JsonLd schema={schema} />;
}
