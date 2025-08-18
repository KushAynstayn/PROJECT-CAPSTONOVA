"use client"

import Image from 'next/image';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/components/ui/sidebar"; 
import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils"; 

interface NavItem {
  href: string
  label: string
  icon?: string
  submenu?: NavItem[]
}

export function NavMain({ items }: { items: NavItem[] }) {
  const pathname = usePathname(); 
  const { isOpen } = useSidebar(); 

  return (
    <SidebarMenu>
      {items.map((item) => (
        <SidebarMenuItem key={item.href}>
          {item.submenu ? (
            <div
              className={cn(
                "flex w-full items-center justify-between rounded-lg p-3",
                pathname.startsWith(item.href) && "bg-white/20"
              )}
            >
              <div className="flex items-center gap-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild disabled={isOpen}>
                    {/* --- THIS IS THE MODIFIED IMAGE COMPONENT --- */}
                    <Image 
                      src={item.icon!} 
                      alt={`${item.label} icon`} 
                      width={20} 
                      height={20}
                      className={cn("transition-transform", !isOpen && "scale-110")}
                    />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent side="right" align="start">
                    {item.submenu.map((subItem) => (
                      <DropdownMenuItem key={subItem.href} asChild> 
                        <Link href={subItem.href} className="flex items-center gap-2">
                          {subItem.icon && <Image src={subItem.icon} alt={subItem.label} width={16} height={16} />}
                          {subItem.label}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                <span className={cn(
                  "whitespace-nowrap transition-all duration-300",
                  isOpen ? "w-full opacity-100" : "w-0 opacity-0"
                )}>
                  {item.label}
                </span>
              </div>
              
              {isOpen && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="p-2 opacity-75 hover:opacity-100">
                      <Image src="/images/dots_icon.png" alt="More options" width={16} height={16} />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent side="right" align="start">
                    {item.submenu.map((subItem) => (
                      <DropdownMenuItem key={subItem.href} asChild>
                        <Link href={subItem.href} className="flex items-center gap-2">
                          {subItem.icon && <Image src={subItem.icon} alt={subItem.label} width={16} height={16} />}
                          {subItem.label}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          ) : (
            <Link
              href={item.href}
              className={cn(
                "flex w-full items-center gap-4 rounded-lg p-2 transition-colors",
                pathname === item.href && "bg-white/20"
              )}
            >
              {item.icon && <Image src={item.icon} alt={`${item.label} icon`} width={20} height={20} />}
              <span className={cn(
                "whitespace-nowrap transition-all duration-300",
                isOpen ? "w-full opacity-100" : "w-0 opacity-0"
              )}>
                {item.label}
              </span>
            </Link>
          )}
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  )
}