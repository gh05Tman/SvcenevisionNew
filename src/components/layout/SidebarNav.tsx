
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { HomeIcon, ImageIcon, UserCircleIcon, MountainIcon } from 'lucide-react';

const navItems = [
  { href: '/app', label: 'Scene Planner', icon: HomeIcon },
  { href: '/app/gallery', label: 'Gallery', icon: ImageIcon },
  { href: '/app/profile', label: 'Profile', icon: UserCircleIcon },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {navItems.map((item) => (
        <SidebarMenuItem key={item.label}>
          <SidebarMenuButton
            asChild
            isActive={pathname === item.href || (item.href !== '/app' && pathname.startsWith(item.href))}
            tooltip={{ children: item.label, className: "bg-popover text-popover-foreground" }}
          >
            <Link href={item.href}>
              <item.icon />
              <span>{item.label}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}

export function SidebarHeaderContent() {
    return (
         <Link href="/app" className="flex items-center gap-2 px-2 py-1" prefetch={false}>
            <MountainIcon className="h-8 w-8 text-primary" />
            <span className="text-xl font-semibold text-sidebar-foreground group-data-[collapsible=icon]:hidden font-montserrat">
              SceneVision
            </span>
          </Link>
    );
}
