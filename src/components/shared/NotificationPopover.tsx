"use client";

import { useEffect, useState, useCallback } from "react";
import { Bell, AlertCircle, FileText, CreditCard, Calendar, CheckCircle2, XCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

type NotificationItem = {
  id: string;
  type: string;
  title: string;
  message: string;
  link: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  date: string;
};

export function NotificationPopover() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch('/api/notifications');
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.data.items || []);
      }
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      fetchNotifications();
      // Poll every 60 seconds
      const interval = setInterval(fetchNotifications, 60000);
      return () => clearInterval(interval);
    }
  }, [fetchNotifications, mounted]);

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="relative text-slate-500 hover:text-emerald-600 hover:bg-slate-100 rounded-full">
        <Bell className="h-5 w-5" />
        <span className="sr-only">Notificaciones</span>
      </Button>
    );
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'PAYMENT_PENDING': return <CreditCard className="h-5 w-5 text-red-500" />;
      case 'DOC_REJECTED': return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'BUDGET_RECEIVED': return <FileText className="h-5 w-5 text-blue-500" />;
      case 'AUDIT_REQUESTED': return <FileText className="h-5 w-5 text-blue-500" />;
      case 'MEETING_REQUESTED': return <Calendar className="h-5 w-5 text-amber-500" />;
      case 'DOC_REVIEW': return <CheckCircle2 className="h-5 w-5 text-emerald-500" />;
      case 'CONSULTA_COTIZADA': return <CreditCard className="h-5 w-5 text-blue-500" />;
      case 'CONSULTA_PENDIENTE': return <AlertCircle className="h-5 w-5 text-amber-500" />;
      case 'CONSULTA_ACEPTADA': return <CheckCircle2 className="h-5 w-5 text-emerald-500" />;
      case 'CONSULTA_RECHAZADA': return <XCircle className="h-5 w-5 text-red-500" />;
      case 'CONSULTA_COMPLETADA': return <CheckCircle2 className="h-5 w-5 text-emerald-500" />;
      default: return <Bell className="h-5 w-5 text-slate-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'HIGH': return "bg-red-50/50 hover:bg-red-50 border-l-4 border-l-red-500";
      case 'MEDIUM': return "bg-blue-50/50 hover:bg-blue-50 border-l-4 border-l-blue-500";
      case 'LOW': return "bg-slate-50/50 hover:bg-slate-50 border-l-4 border-l-slate-400";
      default: return "bg-white hover:bg-slate-50 border-b border-slate-100";
    }
  };

  const markAsRead = async (id: string) => {
    try {
       await fetch(`/api/notifications/${id}/read`, { method: 'POST' });
       setNotifications(prev => prev.filter(n => n.id !== id));
       setOpen(false);
       // window.location.href = link; // Optional: force navigation if Link doesn't handle it well
    } catch (err) {
       console.error("Error marking as read", err);
    }
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative text-slate-500 hover:text-emerald-600 hover:bg-slate-100 rounded-full">
          <Bell className="h-5 w-5" />
          {notifications.length > 0 && (
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 border-2 border-white animate-pulse" />
          )}
          <span className="sr-only">Notificaciones</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 p-0 rounded-2xl shadow-xl border-slate-200" align="end">
        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/50 rounded-t-2xl">
          <h4 className="font-black text-sm text-slate-900 uppercase tracking-wide">Notificaciones</h4>
          {notifications.length > 0 && (
            <Badge variant="secondary" className="bg-slate-900 text-white font-bold h-5 px-2 text-[10px]">
              {notifications.length}
            </Badge>
          )}
        </div>
        <div className="max-h-[350px] overflow-y-auto">
          {loading ? (
            <div className="p-8 text-center text-sm text-slate-400 font-medium">Cargando...</div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center">
               <div className="h-12 w-12 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                  <Bell className="h-6 w-6 text-slate-300" />
               </div>
               <p className="text-sm font-bold text-slate-600">Todo al día</p>
               <p className="text-xs text-slate-400 mt-1">No tienes acciones pendientes.</p>
            </div>
          ) : (
            <div className="grid">
              {notifications.map((item) => (
                <Link 
                  key={item.id} 
                  href={item.link} 
                  onClick={() => {
                     // e.preventDefault(); // If we want to wait for async
                     markAsRead(item.id);
                  }}
                  className={cn(
                    "flex gap-4 p-4 transition-colors border-b border-slate-100 last:border-0",
                    getSeverityColor(item.severity)
                  )}
                >
                  <div className="shrink-0 mt-1">
                    {getIcon(item.type)}
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-slate-900 leading-none">{item.title}</p>
                    <p className="text-xs text-slate-500 line-clamp-2">{item.message}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">
                       {new Date(item.date).toLocaleDateString()}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
