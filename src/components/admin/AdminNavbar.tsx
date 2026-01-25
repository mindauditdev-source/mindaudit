"use client";

import { useSession } from "next-auth/react";
import { Bell, Search, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function AdminNavbar() {
  const { data: session } = useSession();

  return (
    <header className="h-16 border-b border-slate-200 bg-white px-8 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-4">
        {/* Placeholder for Breadcrumbs or Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="search"
            placeholder="Buscar..."
            className="h-9 w-64 rounded-md border border-slate-200 bg-slate-50 pl-9 pr-4 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="text-slate-500 relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 border-2 border-white"></span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-3 px-2 hover:bg-slate-50">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-slate-900 leading-none">
                  {session?.user?.name || "Administrador"}
                </p>
                <p className="text-xs text-slate-500 mt-1 capitalize">
                  {session?.user?.role || "Admin"}
                </p>
              </div>
              <Avatar className="h-8 w-8 border border-slate-200">
                <AvatarFallback className="bg-indigo-100 text-indigo-700">
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Configuración Perfil</DropdownMenuItem>
            <DropdownMenuItem>Soporte Técnico</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">Cerrar Sesión</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
