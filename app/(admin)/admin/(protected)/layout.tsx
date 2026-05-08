import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyAdminJwt } from "@/lib/jwt";
import { AdminNav } from "@/components/admin-nav";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = cookies().get("admin_session")?.value;
  if (!token) redirect("/admin/login");

  try {
    await verifyAdminJwt(token);
  } catch {
    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-dvh-safe flex-col bg-slate-950 text-slate-100 md:flex-row">
      <AdminNav />
      <div className="flex flex-1 flex-col overflow-auto">
        <main className="flex-1 p-5 md:p-8">{children}</main>
      </div>
    </div>
  );
}
