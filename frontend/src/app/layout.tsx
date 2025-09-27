import type { Metadata } from "next";
import { Inter, Orbitron, Black_Ops_One } from 'next/font/google';
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { TopLoader } from "@/components/ui/top-loader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const orbitron = Orbitron({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-orbitron',
});

const blackOpsOne = Black_Ops_One({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-blackops',
});

export const metadata: Metadata = {
  title: "Project Capstonova",
  description:
    "A smart, secure platform designed to streamline capstone project management.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // The "dark" class is removed from here as we are setting a light theme.
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Black+Ops+One&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${blackOpsOne.variable} ${geistSans.variable} ${geistMono.variable} ${inter.variable} ${orbitron.variable} antialiased text-black bg-black`}
      >
        <TopLoader />
        {children}
      </body>
    </html>
  );
}
