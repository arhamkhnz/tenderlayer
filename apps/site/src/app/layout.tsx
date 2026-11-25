import type { Metadata } from "next";

import { fontMono, fontSans, fontSerif } from "@tenderlayer/fonts/next";

import { seoDescription as description, seoTitle as title } from "./_lib/product-metadata";

import "@tenderlayer/ui/globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://tenderlayer.com"),
  title,
  description,
  alternates: { canonical: "/" },
  robots: {
    googleBot: {
      "max-image-preview": "large",
    },
  },
  openGraph: {
    title,
    description,
    url: "/",
    siteName: "TenderLayer",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      style={{ colorScheme: "light" }}
      className={`${fontSans.variable} ${fontSerif.variable} ${fontMono.variable} scrollbar-width:none [&::-webkit-scrollbar]:hidden`}
    >
      <body className="antialiased">{children}</body>
    </html>
  );
}
