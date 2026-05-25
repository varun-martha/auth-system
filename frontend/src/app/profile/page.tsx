import { requireAuth } from "@/lib/require-auth";
import { Sidebar } from "@/components/Sidebar";
import { ProfileHeader } from "@/components/ProfileHeader";
import { ProfileInvitesSection } from "@/components/ProfileInvitesSection";

export default async function ProfilePage() {
  const user = await requireAuth();

  return (
    <div
      className="dashboard-page"
      style={{ display: "flex", padding: 0, alignItems: "stretch" }}
    >
      <Sidebar />
      <main className="dashboard-main">
        <h1 style={{ marginBottom: "2rem", color: "var(--text-primary)" }}>
          My Profile
        </h1>

        <ProfileHeader user={user} />

        <ProfileInvitesSection />
      </main>
    </div>
  );
}
