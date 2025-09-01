// src/app/layout.tsx

import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";

export default function ViewerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Add 'relative' to make this div the positioning context
    <div className="relative bg-black text-white min-h-screen">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}