import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Jeevan & Vibhaswi's Baby Shower Ceremony",
  description: "Join us in celebrating the auspicious Seemantham (Baby Shower) ceremony of Vibhaswi & Jeevan. July 3, 2026 · Cleveland, OH. Details, Muhurtham, and RSVP inside.",
  openGraph: {
    title: "Jeevan & Vibhaswi's Seemantham · Baby Shower Ceremony",
    description: "Join us in celebrating the auspicious Seemantham (Baby Shower) ceremony of Vibhaswi & Jeevan. July 3, 2026 · Cleveland, OH.",
    url: "https://bbyshwr.vercel.app/",
    siteName: "Seemantham Invitation",
    images: [
      {
        url: "https://bbyshwr.vercel.app/og_banner.png",
        width: 1024,
        height: 1024,
        alt: "Jeevan & Vibhaswi's Seemantham — Baby Shower Ceremony, July 3 2026, Cleveland OH",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jeevan & Vibhaswi's Seemantham · Baby Shower Ceremony",
    description: "Join us in celebrating the auspicious Seemantham (Baby Shower) ceremony. July 3, 2026 · Cleveland, OH.",
    images: ["https://bbyshwr.vercel.app/og_banner.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
