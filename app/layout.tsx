import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "EasyLaces Clip — Never Tie Your Shoes Again",
  description:
    "The revolutionary clip-on device that makes lacing instant. Available at Kings Avenue Mall, Paphos, Cyprus. Only €5.99.",
  keywords: [
    "EasyLaces",
    "no-tie laces",
    "shoe clip",
    "Paphos",
    "Cyprus",
    "Kings Avenue Mall",
    "clip-on laces",
  ],
  openGraph: {
    title: "EasyLaces Clip — Never Tie Your Shoes Again",
    description:
      "The revolutionary clip-on device that makes lacing instant. Available at Kings Avenue Mall, Paphos, Cyprus. Only €5.99.",
    type: "website",
    locale: "en_US",
    alternateLocale: "el_GR",
    siteName: "EasyLaces",
  },
  twitter: {
    card: "summary_large_image",
    title: "EasyLaces Clip — Never Tie Your Shoes Again",
    description:
      "The revolutionary clip-on device that makes lacing instant. Only €5.99.",
  },
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              name: "EasyLaces",
              description:
                "The revolutionary clip-on device that makes lacing instant.",
              url: "https://easylaces.com",
              telephone: "+35797661053",
              address: {
                "@type": "PostalAddress",
                streetAddress: "Kings Avenue Mall",
                addressLocality: "Paphos",
                addressCountry: "CY",
                postalCode: "8046",
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: 34.76579,
                longitude: 32.41342,
              },
              openingHoursSpecification: [
                {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: [
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                  ],
                  opens: "10:00",
                  closes: "21:00",
                },
                {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: "Sunday",
                  opens: "11:00",
                  closes: "19:00",
                },
              ],
              priceRange: "€",
            }),
          }}
        />
      </head>
      <body className="bg-cream text-primary antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
