import localFont from "next/font/local";

import type { Metadata } from "next";

import "./globals.css";

const fontSans = localFont({
  src: "./fonts/TimelessSansVF.woff2",
  variable: "--font-timeless-sans",
  weight: "300 800",
  style: "normal",
  display: "block",
});

const fontSerif = localFont({
  src: "./fonts/TimelessSerifVF.woff2",
  variable: "--font-timeless-serif",
  weight: "200 700",
  style: "normal",
  adjustFontFallback: "Times New Roman",
  display: "block",
});

const title = "TenderLayer | Tender and Contract Management";
const description =
  "An open-source, local-first desktop app for managing tenders, contracts, employee records, invoices, and payroll while keeping business data on your computer.";

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
    <html lang="en" className="scrollbar-width:none [&::-webkit-scrollbar]:hidden">
      <body className={`${fontSans.variable} ${fontSerif.variable} antialiased`}>{children}</body>
    </html>
  );
}
