import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";

const fontGeist = Geist({
  subsets: ["latin"],
  display: "swap",
});

const fontMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

const fontSerif = Instrument_Serif({
  variable: "--font-serif",
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
      className="overscroll-none scroll-smooth"
    >
      <body className={`${fontGeist.className} ${fontMono.variable} ${fontSerif.variable} bg-zinc-50 text-zinc-900 antialiased`}>
        {children}
      </body>
    </html>
  );
}
