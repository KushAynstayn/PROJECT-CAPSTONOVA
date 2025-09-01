// src/components/Header.tsx

import Link from "next/link";
import Image from "next/image";

// Import all necessary components for the dropdown menu
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  return (
    <header className="bg-black/80 backdrop-blur-sm sticky top-0 z-50">
      {/* 1. Set a fixed height (e.g., h-16) on the nav bar. */}
      {/* This makes the header height consistent. */}
      <nav className="container h-20 flex justify-between items-center">
    
        {/* 2. Set the Link wrapper to fill the parent's height (h-full). */}
        {/* Now, you can change 'w-40' to any width, and only the logo will resize. */}
        <Link href="/" className="flex items-center"> {/* Added flex and items-center for vertical alignment */}
          <Image
            src="/images/logo_capstonova.png" // Path to your logo image
            alt="Capstonova Logo"
            width={150}  // <-- Set your desired width here (in pixels)
            height={20} // <-- Set your desired height here (in pixels)
            // Removed 'fill' as we are now using explicit width and height
            // removed style={{ objectFit: "contain" }} as it's not needed without 'fill' for simple sizing
          />
        </Link>

        {/* Dropdown Menu Component on the right side */}
        <DropdownMenu>
          <DropdownMenuTrigger className="text-gray-300 hover:text-white transition-colors ml-10">
            MENU
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem asChild>
              <Link href="/">Home</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/library">Library</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/view-suggestions">View Suggestions</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/view-trends">View Trends</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/about">About Us</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/notifications">Notifications</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/account">Account</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>
    </header>
  );
};

export default Header;