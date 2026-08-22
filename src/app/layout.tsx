import type { Metadata } from "next";
import { Geist, Cormorant_Garamond, Great_Vibes, Cinzel } from "next/font/google";
import "./globals.css";
import SplashScreen from "@/components/ui/SplashScreen";
import { ThemeProvider } from "@/context/ThemeContext";
import { ToastProvider } from "@/context/ToastContext";
import { CartProvider } from "@/context/CartContext";
import CartDrawer from "@/components/cart/CartDrawer";

import { getSiteUrl, BRAND_NAME, BRAND_DESCRIPTION, DEFAULT_KEYWORDS } from "@/utils/seo";
import OrganizationJsonLd from "@/components/seo/OrganizationJsonLd";
import { createClient } from "@/utils/supabase/server";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-cormorant-garamond",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const greatVibes = Great_Vibes({
  variable: "--font-great-vibes",
  subsets: ["latin"],
  weight: ["400"],
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${BRAND_NAME} | Traditional & Contemporary South Indian Jewelry`,
    template: `%s | ${BRAND_NAME}`,
  },
  description: BRAND_DESCRIPTION,
  keywords: DEFAULT_KEYWORDS,
  authors: [{ name: BRAND_NAME }],
  creator: BRAND_NAME,
  publisher: BRAND_NAME,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: `${BRAND_NAME} | Traditional & Contemporary South Indian Jewelry`,
    description: BRAND_DESCRIPTION,
    url: siteUrl,
    siteName: BRAND_NAME,
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/images/logo-og.png",
        width: 800,
        height: 800,
        alt: `${BRAND_NAME} - South Indian Jewelry`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${BRAND_NAME} | Traditional & Contemporary South Indian Jewelry`,
    description: BRAND_DESCRIPTION,
    images: ["/images/logo-og.png"],
  },
  icons: {
    icon: "/images/logo-og.png",
    shortcut: "/images/logo-og.png",
    apple: "/images/logo-og.png",
  },
  verification: {
    google: "O-wzs9Mq-JtNGBR3F2Xs8Sjye4AXLM4QdJdMb7TEKSM",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: settings } = await supabase
    .from("settings")
    .select("shop_name, email, phone, whatsapp, instagram, facebook, address")
    .eq("id", true)
    .maybeSingle();

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${cormorantGaramond.variable} ${greatVibes.variable} ${cinzel.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <OrganizationJsonLd settings={settings} />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                  var splashShown = sessionStorage.getItem('nethiel_splash_shown');
                  var navEntries = performance.getEntriesByType('navigation');
                  var isReload = navEntries.length > 0 && navEntries[0].type === 'reload';
                  if (splashShown || isReload) {
                    document.documentElement.classList.add('no-splash');
                  }
                } catch (e) {}
              })()
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <ThemeProvider>
          <ToastProvider>
            <CartProvider>
              <SplashScreen />
              <CartDrawer />
              {children}
            </CartProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
