import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: "TenderLayer | A workspace for tenders and contracts",
  description:
    "An open-source, local-first desktop workspace for contracts, people, payroll, invoices, and the work that follows a tender. In early development.",
  applicationName: "TenderLayer",
  openGraph: {
    title: "TenderLayer | A workspace for tenders and contracts",
    description:
      "Less scattered information. More room to focus. A local-first desktop app for tender and contract operations, built from a real working day.",
    siteName: "TenderLayer",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} h-full overscroll-none scroll-smooth bg-zinc-50 antialiased motion-reduce:scroll-auto`}
    >
      <body className="flex min-h-full flex-col overscroll-none bg-zinc-50 [font-family:var(--font-geist-sans)] text-zinc-900">
        {children}
      </body>
    </html>
  );
}
