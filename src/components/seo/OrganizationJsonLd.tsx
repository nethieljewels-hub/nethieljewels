import JsonLd from "./JsonLd";
import { getSiteUrl, BRAND_NAME, BRAND_DESCRIPTION } from "@/utils/seo";

interface OrganizationJsonLdProps {
  settings?: {
    shop_name?: string | null;
    email?: string | null;
    phone?: string | null;
    whatsapp?: string | null;
    instagram?: string | null;
    facebook?: string | null;
    address?: string | null;
  } | null;
}

export default function OrganizationJsonLd({ settings }: OrganizationJsonLdProps) {
  const baseUrl = getSiteUrl();
  const shopName = settings?.shop_name || BRAND_NAME;

  const sameAs: string[] = [];
  if (settings?.instagram) sameAs.push(settings.instagram);
  if (settings?.facebook) sameAs.push(settings.facebook);

  const contactNumber = settings?.phone || settings?.whatsapp;

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Organization", "JewelryStore"],
        "@id": `${baseUrl}/#organization`,
        name: shopName,
        url: baseUrl,
        logo: {
          "@type": "ImageObject",
          "@id": `${baseUrl}/#logo`,
          url: `${baseUrl}/images/logo-og.png`,
          contentUrl: `${baseUrl}/images/logo-og.png`,
          caption: shopName,
        },
        image: `${baseUrl}/images/logo-og.png`,
        description: BRAND_DESCRIPTION,
        ...(contactNumber ? { telephone: contactNumber } : {}),
        ...(settings?.email ? { email: settings.email } : {}),
        ...(settings?.address
          ? {
              address: {
                "@type": "PostalAddress",
                streetAddress: settings.address,
                addressCountry: "IN",
              },
            }
          : {}),
        ...(sameAs.length > 0 ? { sameAs } : {}),
        currenciesAccepted: "INR",
        priceRange: "₹₹",
      },
      {
        "@type": "WebSite",
        "@id": `${baseUrl}/#website`,
        url: baseUrl,
        name: shopName,
        description: BRAND_DESCRIPTION,
        publisher: {
          "@id": `${baseUrl}/#organization`,
        },
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${baseUrl}/products?search={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };

  return <JsonLd schema={schema} />;
}
