import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";

export default function ViewerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-black text-white min-h-screen">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}