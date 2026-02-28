"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  PieChart,
  LogOut,
  MessageCircle,
  FileText,
} from "lucide-react";
import Image from "next/image";
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
    title: "Presupuestos",
    href: "/auditor/presupuestos",
    icon: FileText,
  },
  {
    title: "Gestión de Consultas",
    href: "/auditor/consultas",
    icon: MessageCircle,
  },
  {
    title: "Finanzas",
    href: "/auditor/finanzas",
    icon: PieChart,
  },
  {
    title: "Contratos",
    href: "/auditor/contratos",
    icon: FileText,
  },
];

export function AuditorSidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col bg-[#0f172a] text-white transition-all duration-300">
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
                    ? "bg-blue-600 text-white shadow-md shadow-blue-900/20"
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
        <div className="flex justify-center mb-6">
          <div className="relative h-8 w-32 opacity-50">
            <Image
              src="/logo/t-png.png"
              alt="MindAudit Logo"
              fill
              className="object-contain brightness-0 invert"
            />
          </div>
        </div>
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
