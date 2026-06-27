import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Jeevan & Vibhaswi's Shreemantam / సీమంతం",
  description: "Join us in celebrating the auspicious Shreemantam (Baby Shower) ceremony of Vibhaswi & Jeevan. Details, Muhurtham, and RSVP inside.",
  openGraph: {
    title: "Jeevan & Vibhaswi's Shreemantam / సీమంతం",
    description: "Join us in celebrating the auspicious Shreemantam (Baby Shower) ceremony of Vibhaswi & Jeevan.",
    url: "https://bbyshwr.vercel.app/",
    siteName: "Shreemantam Invitation",
    images: [
      {
        url: "https://bbyshwr.vercel.app/golden_ganesha.png",
        width: 1024,
        height: 1024,
        alt: "Auspicious Golden Ganesha",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Jeevan & Vibhaswi's Shreemantam / సీమంతం",
    description: "Join us in celebrating the auspicious Shreemantam (Baby Shower) ceremony of Vibhaswi & Jeevan.",
    images: ["https://bbyshwr.vercel.app/golden_ganesha.png"],
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
