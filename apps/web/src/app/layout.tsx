import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter, Montserrat, Lato } from "next/font/google";
import { cn } from "@/lib/utils";
import "./globals.css";
import ConvexClientProvider from "./ConvexClientProvider";

const inter = Inter({ subsets: ["latin"] });
const montserrat = Montserrat({ subsets: ["latin"] });
const lato = Lato({ weight: "400", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Notes App",
  description: "This is an app to take notes.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={cn(inter.className, montserrat.className, lato.className)}
      >
        <ClerkProvider>
          <p className="bg-amber-100 px-4 py-3 text-center text-sm text-amber-950">
            Temporary demo: accounts expire 24 hours after signup and their notes
            are automatically deleted. Please don’t store anything important.
          </p>
          <ConvexClientProvider>{children}</ConvexClientProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
