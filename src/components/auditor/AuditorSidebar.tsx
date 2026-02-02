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
  ShieldCheck,
  ClipboardList,
  MessageCircle,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const sidebarItems = [
  {
    title: "Panel General",
    href: "/auditor/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Asociados",
    href: "/auditor/asociados",
    icon: Users,
  },
  {
    title: "Directorio de Clientes",
    href: "/auditor/clientes",
    icon: Building2,
  },
  {
    title: "Gestión de Consultas",
    href: "/auditor/consultas",
    icon: MessageCircle,
  },
  // {
  //   title: "Gestión de Auditorías",
  //   href: "/auditor/auditorias",
  //   icon: ClipboardList,
  // },
  {
    title: "Paquetes y Categorías",
    href: "/auditor/configuracion", // Mapping to existing configuracion or new one
    icon: Package,
  },
  {
    title: "Finanzas",
    href: "/auditor/finanzas",
    icon: PieChart,
  },
];

export function AuditorSidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col bg-[#0f172a] text-white transition-all duration-300">
      <div className="flex h-16 items-center px-6 border-b border-slate-800">
        <ShieldCheck className="h-6 w-6 mr-2 text-blue-400" />
        <span className="text-xl font-bold tracking-tight text-slate-100">MindAudit Auditor</span>
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
                    ? "bg-blue-600 text-white shadow-md shadow-blue-900/20"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                )}
              >
                <item.icon
                  className={cn(
                    "mr-3 h-5 w-5 flex-shrink-0 transition-colors",
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
