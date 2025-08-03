"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Package,
  Store,
  DollarSign,
  FolderTree,
  ImageIcon,
  FileText,
  Settings,
  Menu,
  LogOut,
  Users,
  BarChart2,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Define sidebar navigation items
const sidebarItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Products",
    href: "/admin/products",
    icon: Package,
  },
  {
    title: "Prices",
    href: "/admin/prices",
    icon: DollarSign,
  },
  // {
  //   title: "Stores",
  //   href: "/admin/stores",
  //   icon: Store,
  // },
  // {
  //   title: "Categories",
  //   href: "/admin/categories",
  //   icon: FolderTree,
  // },
  // {
  //   title: "Images",
  //   href: "/admin/images",
  //   icon: ImageIcon,
  // },
  //   {
  //     title: "Blog",
  //     href: "/admin/blog",
  //     icon: FileText,
  //   },
  //   {
  //     title: "Users", // Added Users page
  //     href: "/admin/users",
  //     icon: Users,
  //   },
  //   {
  //     title: "Analytics", // Added Analytics page
  //     href: "/admin/analytics",
  //     icon: BarChart2,
  //   },
  //   {
  //     title: "Settings",
  //     href: "/admin/settings",
  //     icon: Settings,
  //   },
];

// Sidebar component for navigation
function Sidebar({ className }) {
  const pathname = usePathname(); // Get current path for active link highlighting

  return (
    <div
      className={cn(
        " pb-12 min-h-full bg-gray-900 border-r border-gray-800 relative",
        className
      )}
    >
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          {/* Logo and Admin Panel Title */}
          <div className="flex items-center gap-2 mb-8">
            <h2 className="text-lg font-semibold text-white">
              PriceBlinker Admin
            </h2>
          </div>
          {/* Navigation Links */}
          <div className="space-y-1">
            {sidebarItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-gray-800",
                  pathname === item.href
                    ? "bg-gray-800 text-white"
                    : "text-gray-400 hover:text-white"
                )}
              >
                <item.icon className="h-4 w-4" />{" "}
                {/* Render icon dynamically */}
                {item.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
      {/* Logout Button */}
      <div className="w-full absolute bottom-4 px-3">
        <Button
          variant="default"
          size="default"
          className="w-full justify-start gap-2 bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
}

// Admin Layout component
export default function AdminLayout({ children }) {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] bg-gray-950">
      {/* Desktop Sidebar */}
      <div className="hidden  border-r border-gray-800 md:block">
        <Sidebar />
      </div>
      {/* Main Content Area */}
      <div className="flex flex-col">
        {/* Header for mobile and desktop */}
        <header className="flex h-14 items-center gap-4 border-b border-gray-800 bg-gray-900 px-4 lg:h-[60px] lg:px-6">
          {/* Mobile Sidebar Trigger */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden bg-gray-800 border-gray-700 text-gray-300"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            {/* Mobile Sidebar Content */}
            <SheetContent
              side="left"
              className="flex flex-col bg-gray-900 border-gray-800"
            >
              <Sidebar />
            </SheetContent>
          </Sheet>
          {/* Admin Panel Title in Header */}
          <div className="w-full flex-1">
            <h1 className="text-lg font-semibold md:text-2xl text-white">
              Admin Panel
            </h1>
          </div>
        </header>
        {/* Main content area for pages */}
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-gray-950">
          {children}
        </main>
      </div>
    </div>
  );
}
