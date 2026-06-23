"use client";
import { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { GroupCard } from "@/components/groups/GroupCard";
import { CreateGroupModal } from "@/components/groups/CreateGroupModal";
import { api } from "@/services/api";
import { getFrontendEnv } from "@/lib/env";
import { io, Socket } from "socket.io-client";
import { Group } from "@/types/groups.types";
import "@/styles/groups.css";

export default function GroupsPage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const loadGroups = async (isBackground = false) => {
    if (!isBackground) setLoading(true);
    try {
      const data = await api.getGroups();
      setGroups(data.groups || []);
    } catch (err: any) {
      if (!isBackground) setError(err.message || "Failed to load groups.");
    } finally {
      if (!isBackground) setLoading(false);
    }
  };

  useEffect(() => {
    loadGroups();
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || getFrontendEnv().apiBaseUrl.replace("/api/v1", "");
    const socket: Socket = io(socketUrl, { withCredentials: true, transports: ["websocket", "polling"] });
    socket.on("group_update", () => loadGroups(true));
    return () => { socket.disconnect(); };
  }, []);

  if (loading) {
    return (
      <div style={{ display: "flex", padding: 0, alignItems: "stretch", minHeight: "100vh" }}>
        <Sidebar />
        <div className="groups-page groups-main" style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
          <div style={{ animation: "spin 1s linear infinite", width: 40, height: 40, border: "3px solid var(--border-subtle)", borderTopColor: "var(--brand-accent)", borderRadius: "50%" }} />
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", padding: 0, alignItems: "stretch", minHeight: "100vh" }}>
      <Sidebar />
      <main className="groups-page groups-main" style={{ flex: 1, overflowY: "auto" }}>
        <div className="groups-shell animate-slide-up">
          <div className="groups-header">
            <h1>Your Groups</h1>
            <button id="open-create-group" className="btn-primary hover-lift" onClick={() => setShowCreateModal(true)}>+ Create Group</button>
          </div>
          {error && <div style={{ padding: "1rem", background: "rgba(239,68,68,0.1)", color: "#ef4444", borderRadius: "12px", border: "1px solid rgba(239,68,68,0.2)", marginBottom: "2rem" }}>{error}</div>}
          {groups.length === 0 ? (
            <div className="empty-state">
              <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ margin: "0 auto 1rem", opacity: 0.5 }}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              <h3>No groups yet</h3>
              <p>Create your first group to start splitting expenses with friends.</p>
              <button id="create-first-group" className="btn-primary hover-lift" style={{ marginTop: "1rem" }} onClick={() => setShowCreateModal(true)}>Create a Group</button>
            </div>
          ) : (
            <div className="groups-grid">
              {groups.map((group, index) => (
                <div key={group.id} className="animate-fade-in hover-lift" style={{ animationDelay: `${index * 0.1}s` }}>
                  <GroupCard group={group} />
                </div>
              ))}
            </div>
          )}
        </div>
        {showCreateModal && <CreateGroupModal onClose={() => setShowCreateModal(false)} onCreated={() => loadGroups()} />}
      </main>
    </div>
  );
}
