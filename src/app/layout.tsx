import type { Metadata } from "next";
import { Geist, Cormorant_Garamond, Great_Vibes, Cinzel } from "next/font/google";
import "./globals.css";
import SplashScreen from "@/components/ui/SplashScreen";
import { ThemeProvider } from "@/context/ThemeContext";

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

export const metadata: Metadata = {
  title: {
    default: "Nethiel Jewelry | Premium Handcrafted Jewelry",
    template: "%s | Nethiel Jewelry",
  },
  description:
    "Discover timeless elegance at Nethiel Jewelry. Explore premium gold, silver, and gemstone jewelry collections crafted to celebrate life's most beautiful moments.",
  metadataBase: new URL("https://nethieljewelry.com"),
  openGraph: {
    title: "Nethiel Jewelry | Premium Handcrafted Jewelry",
    description: "Explore premium gold, silver, and gemstone jewelry collections — crafted for life's most precious moments.",
    url: "https://nethieljewelry.com",
    siteName: "Nethiel Jewelry",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nethiel Jewelry | Premium Handcrafted Jewelry",
    description: "Explore premium gold, silver, and gemstone jewelry collections — crafted for life's most precious moments.",
  },
  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${cormorantGaramond.variable} ${greatVibes.variable} ${cinzel.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
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
                } catch (e) {}
              })()
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <ThemeProvider>
          <SplashScreen />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
