"use client";

import { PartnerSidebar } from "@/components/partner/PartnerSidebar";
import { PartnerHeader } from "@/components/partner/PartnerHeader";

export default function PartnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar - Hidden on mobile, handled via Drawer/Sheet usually, but for now fixed */}
      <aside className="hidden w-64 flex-col md:flex">
        <PartnerSidebar />
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <PartnerHeader />
        
        <main className="flex-1 overflow-y-auto p-6 scroll-smooth">
          {children}
        </main>
      </div>
    </div>
  );
}
