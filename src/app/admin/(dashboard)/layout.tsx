import { requireAdmin } from "@/lib/session";
import { AdminNavigation } from "./AdminNavigation";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAdmin();

  return (
    <div className="kc-admin min-h-screen bg-[#f7f5ef] text-[#242824]">
      <AdminNavigation email={user.email} />
      <main className="min-h-screen lg:pl-[258px]">
        <div className="w-full px-4 pb-10 pt-20 sm:px-6 sm:pt-24 lg:px-8 lg:py-8 xl:px-10">
          {children}
        </div>
      </main>
    </div>
  );
}
