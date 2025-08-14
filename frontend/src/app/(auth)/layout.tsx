import type { Metadata } from "next";
// Make sure the path to your fonts and globals.css is correct.
// Using a standard path alias is more robust than relative paths.
import "@/app/globals.css"; 

// You can define specific fonts for this layout or import them from a shared location.
// For consistency, we'll use the same Geist fonts.
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Optional: You can give the auth pages a different title in the browser tab.
export const metadata: Metadata = {
  title: "Capstonova | Authentication",
  description: "Login or register for Project Capstonova.",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* We apply the font variables to the body tag, just like in the root layout */}
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* The children (your login, registration pages, etc.) will be rendered here,
            inheriting the correct fonts and base styles. */}
        {children}
      </body>
    </html>
  );
}
