"use client";
import Link from "next/link";
import { Group } from "@/types/groups.types";

interface Props {
  group: Group;
}

export function GroupCard({ group }: Props) {
  const initials = (name: string) => name.slice(0, 2).toUpperCase();

  return (
    <Link href={`/groups/${group.id}`} className="group-card">
      <div className="group-card-name">{group.name}</div>
      {group.description && (
        <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "0.75rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {group.description}
        </div>
      )}
      <div className="group-card-meta">
        <span>{group.memberCount} member{group.memberCount !== 1 ? "s" : ""}</span>
        <div className="group-member-avatars">
          {group.members.slice(0, 5).map((m) => (
            <div key={m.id} className="group-member-avatar" title={m.username}>
              {m.username.slice(0, 2).toUpperCase()}
            </div>
          ))}
          {group.memberCount > 5 && (
            <div className="group-member-avatar" style={{ background: "rgba(255,255,255,0.1)", color: "var(--text-muted)" }}>
              +{group.memberCount - 5}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
