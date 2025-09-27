

import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";



export default function ViewerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // 3. Apply the font variables to your main container
    <div className={`relative bg-black text-white min-h-screen`}>
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}