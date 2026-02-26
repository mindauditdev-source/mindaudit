"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Building2,
  PieChart,
  Settings,
  LogOut,
  ClipboardList
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const sidebarItems = [
  {
    title: "Panel General",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Colaboradores",
    href: "/admin/colaboradores",
    icon: Users,
  },
  {
    title: "Empresas",
    href: "/admin/empresas",
    icon: Building2,
  },
  {
    title: "Auditorías",
    href: "/admin/auditorias",
    icon: ClipboardList,
  },
  {
    title: "Comisiones",
    href: "/admin/comisiones",
    icon: PieChart,
  },
  {
    title: "Configuración",
    href: "/admin/config",
    icon: Settings,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col bg-slate-900 text-white transition-all duration-300">
      <div className="flex h-16 items-center px-4 border-b border-slate-800">
        <div className="relative h-8 w-32">
          <Image
            src="/logo/t-png.png"
            alt="MindAudit Logo"
            fill
            className="object-contain brightness-0 invert"
          />
        </div>
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
                    ? "bg-indigo-600 text-white shadow-md"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                )}
              >
                <item.icon
                  className={cn(
                    "mr-3 h-5 w-5 shrink-0 transition-colors",
                    isActive ? "text-white" : "text-slate-500 group-hover:text-white"
                  )}
                  aria-hidden="true"
                />
                {item.title}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-slate-800 p-4">
        <Button
          variant="ghost"
          className="w-full justify-start text-slate-400 hover:bg-slate-800 hover:text-white"
          onClick={() => signOut({ callbackUrl: '/login' })}
        >
          <LogOut className="mr-3 h-5 w-5" />
          Cerrar Sesión
        </Button>
      </div>
    </div>
  );
}
