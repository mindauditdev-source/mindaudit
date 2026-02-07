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
  Briefcase,
  MessageCircle,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/partner/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Mis Presupuestos",
    href: "/partner/presupuestos",
    icon: FileText,
  },
  {
    title: "Mis Empresas",
    href: "/partner/clientes",
    icon: Building2,
  },
  // {
  //   title: "Mis Auditorías",
  //   href: "/partner/auditorias",
  //   icon: FileText,
  // },
  {
    title: "Mis Consultas",
    href: "/partner/consultas",
    icon: MessageCircle,
  },
  {
    title: "Paquetes de Horas",
    href: "/partner/paquetes-horas",
    icon: Clock,
  },
  // {
  //   title: "Comisiones",
  //   href: "/partner/facturas", // Using facturas for now based on folder structure
  //   icon: PieChart,
  // },
];

export function PartnerSidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col bg-[#0a3a6b] text-white transition-all duration-300">
      <div className="flex h-16 items-center px-6 border-b border-blue-800">
        <Briefcase className="h-6 w-6 mr-2 text-blue-200" />
        <span className="text-xl font-bold tracking-tight">Portal Colaborador</span>
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
                    ? "bg-blue-800 text-white shadow-md"
                    : "text-blue-100 hover:bg-blue-800/50 hover:text-white"
                )}
              >
                <item.icon
                  className={cn(
                    "mr-3 h-5 w-5 shrink-0 transition-colors",
                    isActive ? "text-white" : "text-blue-300 group-hover:text-white"
                  )}
                  aria-hidden="true"
                />
                {item.title}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-blue-800 p-4">
        <Button
          variant="ghost"
          className="w-full justify-start text-blue-200 hover:bg-blue-800 hover:text-white"
          onClick={() => signOut({ callbackUrl: '/login' })}
        >
          <LogOut className="mr-3 h-5 w-5" />
          Cerrar Sesión
        </Button>
      </div>
    </div>
  );
}
