"use client";

import { usePathname } from "next/navigation";
import { Search, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function Header() {
  const pathname = usePathname();

  const getPageTitle = (path: string) => {
    const segments = path.split("/").filter(Boolean);
    const lastSegment = segments[segments.length - 1];
    if (!lastSegment) return "Dashboard";

    return lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1);
  };

  return (
    <header className="flex items-center justify-between p-4 bg-slate-50/50 border-b border-slate-100 mb-6">
      <div className="flex items-center gap-4 w-full max-w-xl">
        <SidebarTrigger />

        {/*  Title  from path name*/}
        <h1 className="text-xl font-bold text-slate-800 hidden md:block">
          {getPageTitle(pathname)}
        </h1>

        <div className="relative w-full max-w-md hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search..."
            className="pl-10 bg-white border-slate-200 rounded-full w-full shadow-sm"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button className="bg-amber-400 hover:bg-amber-500 text-black font-semibold rounded-full px-6 shadow-sm hidden sm:flex">
          Upgrade
        </Button>
        <Button variant="ghost" size="icon" className="text-slate-500 relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full" />
        </Button>
        <div className="h-8 w-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold shadow-sm">
          V
        </div>
      </div>
    </header>
  );
}
