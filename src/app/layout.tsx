import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import Footer from "@/components/Footer";
import FloatingContactWidget from "@/components/FloatingContactWidget";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Paliwal Properties | Real Estate Consultancy in Kota, Rajasthan",
  description: "25+ years of trusted real estate expertise in Kota. Verified residential plots, luxury homes, commercial spaces, and transparent registry consultancy. Call 9414177565.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <main className="flex-1 flex flex-col">{children}</main>
            <Footer />
            <FloatingContactWidget />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
