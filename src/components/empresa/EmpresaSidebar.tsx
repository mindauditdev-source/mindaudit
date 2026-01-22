"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Building2,
  FileText,
  LogOut,
  Users
} from "lucide-react";
import { Button } from "@/components/ui/button";

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/empresa/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Mis Auditorías",
    href: "/empresa/auditorias",
    icon: FileText,
  },
  {
    title: "Documentos",
    href: "/empresa/documentos",
    icon: Building2,
  },
  {
    title: "Perfil",
    href: "/empresa/perfil",
    icon: Users,
  },
];

export function EmpresaSidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col bg-[#1a2e35] text-white transition-all duration-300">
      <div className="flex h-16 items-center px-6 border-b border-[#2a4e55]">
        <Building2 className="h-6 w-6 mr-2 text-emerald-400" />
        <span className="text-xl font-bold tracking-tight">Portal Cliente</span>
      </div>
      
      <div className="flex-1 overflow-y-auto py-6">
        <nav className="space-y-1 px-3">
          {sidebarItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center rounded-lg px-3 py-3 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-[#2a4e55] text-white shadow-md"
                    : "text-slate-300 hover:bg-[#2a4e55]/50 hover:text-white"
                )}
              >
                <item.icon
                  className={cn(
                    "mr-3 h-5 w-5 flex-shrink-0 transition-colors",
                    isActive ? "text-emerald-400" : "text-slate-400 group-hover:text-emerald-400"
                  )}
                  aria-hidden="true"
                />
                {item.title}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-[#2a4e55] p-4">
        <Button
          variant="ghost"
          className="w-full justify-start text-slate-300 hover:bg-[#2a4e55] hover:text-white"
          onClick={() => signOut({ callbackUrl: '/login' })}
        >
          <LogOut className="mr-3 h-5 w-5" />
          Cerrar Sesión
        </Button>
      </div>
    </div>
  );
}
