"use client";

import React from "react";
import Image from "next/image";

export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
}

export interface UserCardProps {
  user: User;
  actionButton?: React.ReactNode;
}

export function UserCard({ user, actionButton }: UserCardProps) {
  return (
    <div className="premium-user-card">
      <div className="card-content">
        <div className="card-avatar">
          {user.avatar ? (
            <Image
              src={user.avatar}
              alt={`${user.username}'s avatar`}
              fill
              className="object-cover"
              unoptimized={true}
            />
          ) : (
            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)" }}>
              <svg width="24" height="24" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </div>
        <div className="card-info">
          <h3 style={{ textTransform: 'capitalize' }}>{user.username}</h3>
          <p style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" opacity={0.6}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.email}</span>
          </p>
        </div>
      </div>
      {actionButton && (
        <div className="card-actions">
          {actionButton}
        </div>
      )}
    </div>
  );
}
