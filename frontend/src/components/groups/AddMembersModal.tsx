"use client";
import { useState } from "react";
import { api } from "@/services/api";

interface SearchUser {
  id: string;
  username: string;
  email: string;
}

interface Props {
  groupId: string;
  existingMemberIds: string[];
  onClose: () => void;
  onAdded: () => void;
}

export function AddMembersModal({ groupId, existingMemberIds, onClose, onAdded }: Props) {
  const [memberQuery, setMemberQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchUser[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<SearchUser[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (q: string) => {
    setMemberQuery(q);
    if (q.trim().length < 2) { setSearchResults([]); return; }
    setIsSearching(true);
    try {
      const results = await api.searchUsers(q);
      const alreadySelected = new Set(selectedMembers.map((m) => m.id));
      setSearchResults((results || []).filter((u: SearchUser) => !alreadySelected.has(u.id)));
    } catch { setSearchResults([]); }
    finally { setIsSearching(false); }
  };

  const addMember = (user: SearchUser) => {
    setSelectedMembers((prev) => [...prev, user]);
    setSearchResults((prev) => prev.filter((u) => u.id !== user.id));
    setMemberQuery("");
  };

  const removeMember = (id: string) => setSelectedMembers((prev) => prev.filter((m) => m.id !== id));

  const handleSubmit = async () => {
    if (selectedMembers.length === 0) return;
    setIsSubmitting(true);
    setError("");
    try {
      await api.addGroupMembers(groupId, selectedMembers.map((m) => m.id));
      onAdded();
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to add members.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3 style={{ margin: "0 0 1.5rem 0", fontFamily: "Outfit, sans-serif" }}>Add Members</h3>
        {error && <div style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444", padding: "0.75rem", borderRadius: "8px", marginBottom: "1rem", fontSize: "0.9rem" }}>{error}</div>}
        
        <div className="modal-form-group">
          <label className="modal-label">Search Friends</label>
          <div className="friends-search-container" style={{ marginBottom: selectedMembers.length > 0 ? "0.75rem" : "0" }}>
            <svg className="search-icon" width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input id="add-member-search" className="friends-search-input modal-input" style={{ paddingLeft: "2.5rem" }} value={memberQuery} onChange={(e) => handleSearch(e.target.value)} placeholder="Search by username or email..." />
          </div>
          {selectedMembers.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.75rem" }}>
              {selectedMembers.map((m) => (
                <span key={m.id} style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: "20px", padding: "0.3rem 0.75rem", fontSize: "0.85rem", color: "var(--brand-accent)" }}>
                  @{m.username}
                  <button onClick={() => removeMember(m.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "inherit", padding: 0, lineHeight: 1, fontSize: "1rem" }} aria-label={`Remove ${m.username}`}>×</button>
                </span>
              ))}
            </div>
          )}
          {isSearching && <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", padding: "0.5rem 0" }}>Searching...</div>}
          {searchResults.length > 0 && (
            <div style={{ border: "1px solid var(--border-subtle)", borderRadius: "12px", overflow: "hidden", marginTop: "0.25rem" }}>
              {searchResults.slice(0, 5).map((u) => {
                const isExisting = existingMemberIds.includes(u.id);
                return (
                  <button key={u.id} onClick={() => !isExisting && addMember(u)} disabled={isExisting} style={{ width: "100%", display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.75rem 1rem", background: "transparent", border: "none", borderBottom: "1px solid var(--border-subtle)", cursor: isExisting ? "default" : "pointer", color: "var(--text-primary)", textAlign: "left", opacity: isExisting ? 0.5 : 1 }}>
                    <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(16,185,129,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 700, color: "var(--brand-accent)", flexShrink: 0 }}>{u.username.slice(0, 2).toUpperCase()}</div>
                    <div style={{ flex: 1 }}><div style={{ fontWeight: 500 }}>@{u.username}</div><div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{u.email}</div></div>
                    {isExisting && <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", padding: "0.2rem 0.5rem", background: "rgba(255,255,255,0.05)", borderRadius: "12px" }}>Already added</div>}
                  </button>
                );
              })}
            </div>
          )}
        </div>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end", marginTop: "1.5rem" }}>
          <button className="btn-secondary" onClick={onClose} disabled={isSubmitting}>Cancel</button>
          <button className="btn-primary" onClick={handleSubmit} disabled={isSubmitting || selectedMembers.length === 0}>{isSubmitting ? "Adding..." : `Add ${selectedMembers.length || ""} Member${selectedMembers.length !== 1 ? "s" : ""}`}</button>
        </div>
      </div>
    </div>
  );
}
