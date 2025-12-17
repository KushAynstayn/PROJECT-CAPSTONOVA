"use client";

import Link from "next/link";
import Image from "next/image";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useState, useEffect, ReactNode, memo } from "react";
import { Home, Library, Lightbulb, TrendingUp, Info, Bell, User, FileText, LucideProps } from "lucide-react";
import { usePathname } from "next/navigation";
import AOS from "aos";
import "aos/dist/aos.css";

// --- OPTIMIZATION 1: Data-driven Menu Items ---
// Storing menu data in an array makes it easier to manage and scale.
const menuItems = [
  { href: "/", Icon: Home, label: "Home", delay: 50 },
  { href: "/library", Icon: Library, label: "Library", delay: 100 },
  { href: "/view-suggestions", Icon: Lightbulb, label: "View Suggestions", delay: 150 },
  { href: "/view-trends", Icon: TrendingUp, label: "View Trends", delay: 200 },
  { href: "/about", Icon: Info, label: "About Us", delay: 250 },
  { href: "/notifications", Icon: Bell, label: "Notifications", delay: 300 },
  { href: "/account", Icon: User, label: "Account", delay: 350 },
  { href: "/acm-templates", Icon: FileText, label: "ACM Templates", delay: 400 },
];

// --- OPTIMIZATION 2: Memoized MenuLink Component ---
// React.memo prevents the component from re-rendering if its props haven't changed.
interface MenuLinkProps {
  href: string;
  delay?: number;
  children: ReactNode;
  onClick: () => void;
}

const MenuLink = memo(({ href, delay, children, onClick }: MenuLinkProps) => (
  <Link href={href} passHref>
    <div
      onClick={onClick}
      className="group bg-black/20 text-white rounded-md flex flex-col items-center justify-center gap-2 p-3 h-40 w-full backdrop-blur-md transition-all duration-300 ease-out transform scale-95 hover:scale-105 border border-yellow-500"
      data-aos="fade-up"
      data-aos-delay={delay}
    >
      {children}
    </div>
  </Link>
));
MenuLink.displayName = 'MenuLink';


const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  // Initialize AOS library on component mount
  useEffect(() => {
    AOS.init({
      once: true,
      duration: 500,
      easing: "ease-out-quad",
    });
  }, []);

  // Close the popover menu on any route change
  useEffect(() => {
    if (menuOpen) {
      setMenuOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);
  
  // --- OPTIMIZATION 3: Consolidated Styles ---
  // Keep styles in one place for consistency.
  const STYLES = {
      icon: "h-10 w-10 md:h-12 md:w-12 text-[#f5b301] group-hover:text-white transition-colors duration-300",
      text: "text-xs md:text-sm font-semibold uppercase text-center group-hover:text-white transition-colors duration-300",
  };

  const hamburgerLine = `block w-7 h-0.75 rounded-full transition-all duration-300 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600`;

  return (
    <header className="group fixed inset-x-0 top-0 z-50 duration-200">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/75 opacity-100 lg:h-24"
        style={{
          mask: "linear-gradient(black, black, transparent)",
          backdropFilter: "blur(8px)",
        }}
      />

      <nav className="h-18 flex justify-between items-center relative py-12 px-4 md:px-8">
        <Link href="/" className="flex items-center">
          <Image
            src="/images/logo_capstonova.png"
            alt="Capstonova Logo"
            width={150}
            height={20}
          />
        </Link>

        <Popover open={menuOpen} onOpenChange={setMenuOpen}>
          <PopoverTrigger asChild>
            <button className="relative w-7 h-7 flex flex-col items-center justify-center gap-1 focus:outline-none mr-10">
              <span className={`${hamburgerLine} ${menuOpen ? "rotate-45 translate-y-[7px]" : ""}`} />
              <span className={`${hamburgerLine} ${menuOpen ? "opacity-0" : ""}`} />
              <span className={`${hamburgerLine} ${menuOpen ? "-rotate-45 -translate-y-[7px]" : ""}`} />
            </button>
          </PopoverTrigger>

          <PopoverContent
            align="center"
            className="w-screen max-w-[1280px] border-none rounded-xl mt-14 mx-10 p-4 flex items-center justify-center backdrop-blur-xl bg-black/30"
          >
            <div className="grid grid-cols-4 gap-4 w-full">
              {/* --- OPTIMIZATION 4: Render Menu Items with a Loop --- */}
              {menuItems.map(({ href, Icon, label, delay }) => (
                <MenuLink
                  key={href}
                  href={href}
                  delay={delay}
                  onClick={() => setMenuOpen(false)}
                >
                  <Icon className={STYLES.icon} />
                  <span className={STYLES.text}>{label}</span>
                </MenuLink>
              ))}
  
            </div>
          </PopoverContent>
        </Popover>
      </nav>
    </header>
  );
};

export default Header;