import type { AuthenticatedUser } from "@/types/auth/register";

export function DashboardProfileCard({ user }: { user: AuthenticatedUser }) {
  return (
    <section className="dashboard-profile-card">
      <h2>{user.username}</h2>
      <p>{user.email}</p>
    </section>
  );
}
