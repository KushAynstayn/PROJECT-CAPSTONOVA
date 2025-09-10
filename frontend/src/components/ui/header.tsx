"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState, useEffect, ReactNode } from "react";
import {
  Home,
  Library,
  Lightbulb,
  TrendingUp,
  Info,
  Bell,
  User,
} from "lucide-react";
import { usePathname } from "next/navigation";
import AOS from "aos";
import "aos/dist/aos.css";

// Small helper so every menu item closes the popover before navigating
interface MenuLinkProps {
  href: string;
  delay?: number;
  children: ReactNode;
  onClick: () => void;
}

const MenuLink = ({ href, delay, children, onClick }: MenuLinkProps) => (
  <Link href={href}>
    <div
      onClick={onClick}
      className="group bg-black/20 text-white rounded-md flex flex-col items-center justify-center gap-2 p-3 h-40 w-full backdrop-blur-md transition-all duration-300 ease-out transform scale-95 hover:scale-105 border border-yellow-500"
      data-aos="fade-up"
      data-aos-delay={delay}
    >
      {children}
    </div>
  </Link>
);

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname(); // App Router current path

  useEffect(() => {
    AOS.init({
      once: true,
      duration: 500,
      easing: "ease-out-quad",
    });
  }, []);

  // ✅ Close the popover on any route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const iconStyle =
    "h-10 w-10 md:h-12 md:w-12 text-[#f5b301] group-hover:text-white transition-colors duration-300";
  const textStyle =
    "text-xs md:text-sm font-semibold uppercase text-center group-hover:text-white transition-colors duration-300";

  return (
    <header className="group fixed inset-x-0 top-0 z-50 duration-200">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/75 opacity-100 lg:h-24"
        style={{
          mask: "linear-gradient(black, black, transparent)",
          backdropFilter: "blur(8px)",
        }}
      ></div>

      <nav className="h-18 flex justify-between items-center relative py-12 px-4 md:px-8">
        <Link href="/" className="flex items-center">
          <Image
            src="/images/logo_capstonova.png"
            alt="Capstonova Logo"
            width={150}
            height={20}
          />
        </Link>

        {/* ✅ Make the Popover controlled */}
        <Popover open={menuOpen} onOpenChange={setMenuOpen}>
          <PopoverTrigger asChild>
            <button className="relative w-7 h-7 flex flex-col items-center justify-center gap-1 focus:outline-none mr-10">
              <span
                className={`block w-7 h-0.75 rounded-full transition-all duration-300 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 ${
                  menuOpen ? "rotate-46 translate-y-1.75" : ""
                }`}
              />
              <span
                className={`block w-7 h-0.75 rounded-full transition-all duration-300 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 ${
                  menuOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`block w-7 h-0.75 rounded-full transition-all duration-300 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 ${
                  menuOpen ? "-rotate-45 -translate-y-1.75" : ""
                }`}
              />
            </button>
          </PopoverTrigger>

          <PopoverContent
            align="center"
            className="w-screen max-w-[1280px] border-none rounded-xl mt-14 mx-10 p-4 flex items-center justify-center backdrop-blur-xl bg-black/30"
          >
            <div className="grid grid-cols-4 gap-4 w-full">
              <MenuLink href="/" delay={50} onClick={() => setMenuOpen(false)}>
                <Home className={iconStyle} />
                <span className={textStyle}>Home</span>
              </MenuLink>

              <MenuLink href="/library" delay={100} onClick={() => setMenuOpen(false)}>
                <Library className={iconStyle} />
                <span className={textStyle}>Library</span>
              </MenuLink>

              <MenuLink href="/view-suggestions" delay={150} onClick={() => setMenuOpen(false)}>
                <Lightbulb className={iconStyle} />
                <span className={textStyle}>View Suggestions</span>
              </MenuLink>

              <MenuLink href="/view-trends" delay={200} onClick={() => setMenuOpen(false)}>
                <TrendingUp className={iconStyle} />
                <span className={textStyle}>View Trends</span>
              </MenuLink>

              <MenuLink href="/about" delay={250} onClick={() => setMenuOpen(false)}>
                <Info className={iconStyle} />
                <span className={textStyle}>About Us</span>
              </MenuLink>

              <MenuLink href="/notifications" delay={300} onClick={() => setMenuOpen(false)}>
                <Bell className={iconStyle} />
                <span className={textStyle}>Notifications</span>
              </MenuLink>

              <MenuLink href="/account" delay={350} onClick={() => setMenuOpen(false)}>
                <User className={iconStyle} />
                <span className={textStyle}>Account</span>
              </MenuLink>

              <div
                className="flex items-center justify-center"
                data-aos="fade-up"
                data-aos-delay={0}
              >
                <Image
                  src="/images/logo_capstonova.png"
                  alt="Logo"
                  width={150}
                  height={150}
                />
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </nav>
    </header>
  );
};

export default Header;
 