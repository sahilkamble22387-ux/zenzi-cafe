import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ZENZI Restaurant Cafe | Dhole Patil Road, Pune",
  description:
    "ZENZI Restaurant Cafe — Premium North Indian, Mughlai, Chinese & Seafood dining in Pune. Warm atmosphere, family-friendly, unforgettable flavors. Rated 4.9 on JustDial.",
  keywords: [
    "ZENZI",
    "ZENZI Restaurant Cafe",
    "Pune restaurant",
    "Dhole Patil Road",
    "North Indian",
    "Mughlai",
    "Biryani",
    "Chinese",
    "Seafood",
    "Kebab",
  ],
  authors: [{ name: "ZENZI Restaurant Cafe" }],
  icons: {
    icon: "/images/zenzi/logo.png",
  },
  openGraph: {
    title: "ZENZI Restaurant Cafe | Pune",
    description: "Premium North Indian, Mughlai & Chinese dining in Pune",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${playfair.variable} ${inter.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
