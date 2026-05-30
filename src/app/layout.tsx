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
  title: "Cafe From The Tree | Koregaon Park, Pune",
  description:
    "A cozy tree-shaded cafe in Koregaon Park, Pune serving artisan sourdough pizzas, handcrafted coffees, and fresh Italian-inspired cuisine. Warm ambience, great food, unforgettable experience.",
  keywords: [
    "Cafe From The Tree",
    "Pune cafe",
    "Koregaon Park",
    "sourdough pizza",
    "Italian cafe",
    "coffee shop Pune",
  ],
  authors: [{ name: "Cafe From The Tree" }],
  icons: {
    icon: "/images/logo-cafe.png",
  },
  openGraph: {
    title: "Cafe From The Tree | Koregaon Park, Pune",
    description:
      "Artisan sourdough pizzas & handcrafted coffees under the trees",
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
