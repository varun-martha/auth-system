import { DashboardProfileCard } from "@/components/auth/DashboardProfileCard";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { requireAuth } from "@/lib/require-auth";

export default async function DashboardPage() {
  const user = await requireAuth();

  return (
    <main className="dashboard-page">
      <section className="dashboard-shell">
        <h1>Dashboard</h1>
        <p>You are signed in and your protected profile is active.</p>
        <DashboardProfileCard user={user} />
        <LogoutButton />
      </section>
    </main>
  );
}
