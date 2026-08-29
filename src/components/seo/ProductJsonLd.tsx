import JsonLd from "./JsonLd";
import { getSiteUrl, BRAND_NAME, generateProductSeoDescription } from "@/utils/seo";

interface ProductData {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  seo_description?: string | null;
  original_price: number;
  selling_price?: number | null;
  is_out_of_stock: boolean;
  images: string[];
  product_code?: string | null;
  categories?: {
    name: string;
  } | null;
}

interface ProductJsonLdProps {
  product: ProductData;
}

export default function ProductJsonLd({ product }: ProductJsonLdProps) {
  const baseUrl = getSiteUrl();
  const productUrl = `${baseUrl}/products/${product.slug}`;
  const effectivePrice =
    product.selling_price !== null &&
    product.selling_price !== undefined &&
    product.selling_price > 0 &&
    product.selling_price < product.original_price
      ? product.selling_price
      : product.original_price;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${productUrl}#product`,
    name: product.title,
    description: generateProductSeoDescription(product),
    image:
      product.images && product.images.length > 0
        ? product.images
        : [`${baseUrl}/images/logo-og.png`],
    sku: product.product_code || product.id,
    brand: {
      "@type": "Brand",
      name: BRAND_NAME,
    },
    ...(product.categories?.name ? { category: product.categories.name } : {}),
    offers: {
      "@type": "Offer",
      url: productUrl,
      priceCurrency: "INR",
      price: effectivePrice,
      itemCondition: "https://schema.org/NewCondition",
      availability: product.is_out_of_stock
        ? "https://schema.org/OutOfStock"
        : "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: BRAND_NAME,
      },
    },
  };

  return <JsonLd schema={schema} />;
}
