import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Jeevan & Vibhaswi's Baby Shower Ceremony",
  description: "Join us in celebrating the auspicious Seemantham (Baby Shower) ceremony of Vibhaswi & Jeevan. Details, Muhurtham, and RSVP inside.",
  openGraph: {
    title: "Jeevan & Vibhaswi's Baby Shower Ceremony",
    description: "Join us in celebrating the auspicious Seemantham (Baby Shower) ceremony of Vibhaswi & Jeevan.",
    url: "https://bbyshwr.vercel.app/",
    siteName: "Baby Shower Invitation",
    images: [
      {
        url: "https://bbyshwr.vercel.app/baby-ganesha.png",
        width: 1024,
        height: 1024,
        alt: "Baby Ganesha",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Jeevan & Vibhaswi's Baby Shower Ceremony",
    description: "Join us in celebrating the auspicious Seemantham (Baby Shower) ceremony of Vibhaswi & Jeevan.",
    images: ["https://bbyshwr.vercel.app/baby-ganesha.png"],
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
