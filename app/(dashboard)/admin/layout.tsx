import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { UserRole } from "@prisma/client";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminNavbar } from "@/components/admin/AdminNavbar";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== UserRole.ADMIN) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <div className="fixed inset-y-0 z-50 flex w-64 flex-col">
        <AdminSidebar />
      </div>
      <div className="flex flex-1 flex-col pl-64">
        <AdminNavbar />
        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
