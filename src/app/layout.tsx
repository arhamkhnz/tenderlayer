import localFont from "next/font/local";

import type { Metadata } from "next";
import "./globals.css";

const fontSans = localFont({
  src: "./fonts/TimelessSansVF.woff2",
  variable: "--font-timeless-sans",
  weight: "300 800",
  style: "normal",
  display: "swap",
});

const fontSerif = localFont({
  src: "./fonts/TimelessSerifVF.woff2",
  variable: "--font-timeless-serif",
  weight: "200 700",
  style: "normal",
  adjustFontFallback: "Times New Roman",
  display: "swap",
});

const title = "TenderLayer | A local-first workspace for tenders and contracts";
const description =
  "An open-source desktop app for awarded tenders, contracts, employee records, invoices, and payroll. Local-first and in early development.";

export const metadata: Metadata = {
  title,
  description,
  applicationName: "TenderLayer",
  openGraph: {
    title,
    description,
    siteName: "TenderLayer",
    type: "website",
  },
  twitter: { card: "summary", title, description },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="[scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <body className={`${fontSans.variable} ${fontSerif.variable} antialiased`}>{children}</body>
    </html>
  );
}
