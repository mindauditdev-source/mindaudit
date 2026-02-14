"use client";

import { useSession } from "next-auth/react";
import { Search, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { NotificationPopover } from "@/components/shared/NotificationPopover";

export function AuditorNavbar() {
  const { data: session } = useSession();

  return (
    <header className="h-16 border-b border-slate-200 bg-white px-8 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <div className="relative hidden md:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="search"
            placeholder="Buscar expedientes, clientes..."
            className="h-9 w-64 rounded-md border border-slate-200 bg-slate-50 pl-9 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all font-medium placeholder:font-normal"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <NotificationPopover />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-3 px-2 hover:bg-slate-50 rounded-lg">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-900 leading-none">
                  {session?.user?.name || "Auditor Principal"}
                </p>
                <p className="text-[10px] uppercase font-extrabold text-blue-600 tracking-wider mt-1">
                  {session?.user?.role || "AUDITOR"}
                </p>
              </div>
              <Avatar className="h-9 w-9 border-2 border-slate-100 shadow-sm">
                <AvatarFallback className="bg-blue-600 text-white font-bold">
                  {session?.user?.name?.substring(0, 1) || <User className="h-4 w-4" />}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 mt-2 border-slate-200 shadow-xl rounded-xl">
            <DropdownMenuLabel className="text-slate-500 font-bold uppercase text-[10px] tracking-widest px-3 pt-3">Mi Perfil</DropdownMenuLabel>
            <div className="px-3 pb-3 pt-1">
               <p className="text-sm font-bold text-slate-900">{session?.user?.name}</p>
               <p className="text-xs text-slate-500">{session?.user?.email}</p>
            </div>
            <DropdownMenuSeparator className="bg-slate-100" />
            <DropdownMenuItem className="text-red-600 cursor-pointer font-bold py-2.5 rounded-lg mx-1 focus:bg-red-50 focus:text-red-700">
               Cerrar Sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
