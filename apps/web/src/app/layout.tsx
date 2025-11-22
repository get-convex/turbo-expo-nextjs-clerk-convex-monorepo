import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";


const ppPangram = localFont({
  src: [
    {
      path: "../fonts/PPPangramSansCompact-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../fonts/PPPangramSansCompact-Semibold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../fonts/PPPangramSansCompact-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-pangram",
});

const ppObject = localFont({
  src: "../fonts/PPObjectSans-Bold.ttf",
  variable: "--font-object",
});

export const metadata: Metadata = {
  title: "Recify - Keeper & Organizer",
  description: "All your favorite recipes, finally in one place.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${ppPangram.variable} ${ppObject.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
