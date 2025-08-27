// src/components/Header.tsx

import Link from "next/link";
// It's a good practice to use an icon library like lucide-react
// import { Search } from 'lucide-react';

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
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-white">
          CAPSTONOVA
        </Link>

        {/* Dropdown Menu Component on the right side */}
        <DropdownMenu>
          <DropdownMenuTrigger className="text-gray-300 hover:text-white transition-colors">
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