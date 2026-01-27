import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { NotificationPopover } from "@/components/shared/NotificationPopover";

export function EmpresaHeader() {
  const { user } = useAuth();
  
  const initials = user?.name
    ? user.name.split(" ").map((n: string) => n[0]).join("").substring(0, 2).toUpperCase()
    : "EM";

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b bg-white px-6 shadow-sm">
      <div className="flex items-center gap-4 lg:w-96">
        {/* Espacio reservado para buscador si se necesita */}
        <h2 className="text-lg font-semibold text-slate-700">Mi Panel</h2>
      </div>
      
      <div className="flex items-center gap-4">
        <NotificationPopover />
        
        <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
          <div className="hidden text-right md:block">
            <p className="text-sm font-semibold text-slate-900">{user?.name || "Empresa"}</p>
            <p className="text-xs text-slate-500">{user?.email}</p>
          </div>
          <Avatar>
            <AvatarImage src={user?.image || ""} alt={user?.name || "User"} />
            <AvatarFallback className="bg-emerald-100 text-emerald-700 font-bold">{initials}</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
