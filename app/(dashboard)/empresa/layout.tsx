"use client";

import { EmpresaSidebar } from "@/components/empresa/EmpresaSidebar";
import { EmpresaHeader } from "@/components/empresa/EmpresaHeader";

export default function EmpresaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-slate-50">
      <aside className="hidden w-64 flex-col md:flex">
        <EmpresaSidebar />
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden">
        <EmpresaHeader />
        <main className="flex-1 overflow-y-auto p-6 scroll-smooth">
          {children}
        </main>
      </div>
    </div>
  );
}
