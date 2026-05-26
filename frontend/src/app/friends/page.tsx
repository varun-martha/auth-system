"use client";

import React, { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { UserCard, User } from "@/components/UserCard";
import { api } from "@/services/api";
import { getFrontendEnv } from "@/lib/env";
import { io, Socket } from "socket.io-client";

type TabState = "friends" | "pending" | "find";

interface FriendData {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  friendshipId: string;
}

interface PendingRequest extends FriendData {
  direction: "incoming" | "outgoing";
}

export default function FriendsPage() {
  const [activeTab, setActiveTab] = useState<TabState>("friends");
  const [friends, setFriends] = useState<FriendData[]>([]);
  const [pendingRequests, setPendingRequests] = useState<PendingRequest[]>([]);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [sentRequests, setSentRequests] = useState<Set<string>>(new Set());
  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; friendshipId: string | null; message: string }>({ isOpen: false, friendshipId: null, message: "" });
  const [currentUser, setCurrentUser] = useState<any>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadFriends = async (isBackgroundSync = false) => {
    if (!isBackgroundSync) {
      setLoading(true);
      setError("");
    }
    try {
      const [data, user] = await Promise.all([
        api.getFriends(),
        api.getCurrentUser().catch(() => null)
      ]);
      setFriends(data.friends || []);
      setPendingRequests(data.pendingRequests || []);
      if (user) {
        setCurrentUser((prev: any) => prev ? prev : (user.user || user));
      }
    } catch (err: any) {
      if (!isBackgroundSync) {
        setError(err.message || "Failed to load friends.");
      }
    } finally {
      if (!isBackgroundSync) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    loadFriends();

    const socket: Socket = io(getFrontendEnv().apiBaseUrl.replace('/api/v1', ''), {
      withCredentials: true,
      transports: ['websocket', 'polling']
    });

    socket.on("friend_update", () => {
      loadFriends(true);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const performSearch = async () => {
      if (debouncedQuery.trim().length < 2) {
        setSearchResults([]);
        return;
      }
      setIsSearching(true);
      try {
        const results = await api.searchUsers(debouncedQuery);
        setSearchResults(results);
      } catch (err: any) {
        console.error("Search error:", err);
      } finally {
        setIsSearching(false);
      }
    };
    if (activeTab === "find") {
      performSearch();
    }
  }, [debouncedQuery, activeTab]);

  const executeRemoveFriend = async () => {
    if (!confirmModal.friendshipId) return;
    const id = confirmModal.friendshipId;
    setConfirmModal({ isOpen: false, friendshipId: null, message: "" });
    try {
      await api.removeFriend(id);
      setFriends(friends.filter(f => f.friendshipId !== id));
      setPendingRequests(pendingRequests.filter(pr => pr.friendshipId !== id));
    } catch (err: any) {
      alert(err.message || "Failed to remove friend.");
    }
  };

  const confirmRemoveFriend = (friendshipId: string, username: string, type: "remove" | "cancel" | "reject") => {
    let message = "";
    if (type === "remove") message = `Are you sure want to remove @${username} as friend?`;
    else if (type === "cancel") message = `Are you sure want to cancel your request to @${username}?`;
    else message = `Are you sure want to reject the request from @${username}?`;

    setConfirmModal({
      isOpen: true,
      friendshipId,
      message
    });
  };

  const handleAcceptFriend = async (friendshipId: string) => {
    try {
      await api.acceptFriendRequest(friendshipId);
      setPendingRequests(pendingRequests.filter(pr => pr.friendshipId !== friendshipId));
      loadFriends();
    } catch (err: any) {
      alert(err.message || "Failed to accept friend request.");
    }
  };

  const handleAddFriend = async (targetUserId: string) => {
    try {
      await api.sendFriendRequest(targetUserId);
      setSentRequests(prev => new Set(prev).add(targetUserId));
      loadFriends();
    } catch (err: any) {
      alert(err.message || "Failed to send friend request.");
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", padding: 0, alignItems: "stretch", minHeight: "100vh" }}>
        <Sidebar />
        <div className="friends-page" style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
          <div style={{ animation: "spin 1s linear infinite", width: "40px", height: "40px", border: "3px solid var(--border-subtle)", borderTopColor: "var(--brand-accent)", borderRadius: "50%" }}></div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", padding: 0, alignItems: "stretch", minHeight: "100vh" }}>
      <Sidebar />
      <main className="friends-page dashboard-main" style={{ flex: 1, overflowY: "auto" }}>
        <div className="friends-shell">
        <div className="friends-header">
          <h1>Friends</h1>
          <div className="friends-tabs">
            <button 
              className={`friends-tab ${activeTab === "friends" ? "active" : ""}`}
              onClick={() => setActiveTab("friends")}
            >
              My Friends
            </button>
            <button 
              className={`friends-tab ${activeTab === "pending" ? "active" : ""}`}
              onClick={() => setActiveTab("pending")}
            >
              Requests
              {pendingRequests.filter(r => r.direction === "incoming").length > 0 && <span className="badge">{pendingRequests.filter(r => r.direction === "incoming").length}</span>}
            </button>
            <button 
              className={`friends-tab ${activeTab === "find" ? "active" : ""}`}
              onClick={() => setActiveTab("find")}
            >
              Find Friends
            </button>
          </div>
        </div>

        {error && (
          <div style={{ padding: "1rem", background: "rgba(239, 68, 68, 0.1)", color: "#ef4444", borderRadius: "12px", border: "1px solid rgba(239, 68, 68, 0.2)", marginBottom: "2rem" }}>
            {error}
          </div>
        )}

        <div className="friends-content">
          {activeTab === "friends" && (
            <div>
              {friends.length === 0 ? (
                <div className="empty-state">
                  <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ margin: "0 auto 1rem", opacity: 0.5 }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <h3>No friends yet</h3>
                  <p>Start building your network by finding people.</p>
                  <button className="btn-primary" style={{ marginTop: "1rem" }} onClick={() => setActiveTab("find")}>Find Friends</button>
                </div>
              ) : (
                <div className="grid-list">
                  {friends.map((friend) => (
                    <UserCard
                      key={friend.friendshipId}
                      user={{
                        id: friend.id,
                        username: friend.username,
                        email: friend.email,
                        avatar: friend.avatar
                      }}
                      actionButton={
                        <button className="btn-danger" onClick={() => confirmRemoveFriend(friend.friendshipId, friend.username, "remove")}>
                          Remove
                        </button>
                      }
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "pending" && (
            <div>
              {pendingRequests.length === 0 ? (
                <div className="empty-state">
                  <h3>No pending requests</h3>
                  <p>You're all caught up!</p>
                </div>
              ) : (
                <div className="grid-list">
                  {pendingRequests.map((req) => (
                    <UserCard
                      key={req.friendshipId}
                      user={{
                        id: req.id,
                        username: req.username,
                        email: req.email,
                        avatar: req.avatar
                      }}
                      actionButton={
                        <div style={{ display: "flex", gap: "0.5rem" }}>
                          {req.direction === "incoming" && (
                            <button className="btn-primary" onClick={() => handleAcceptFriend(req.friendshipId)}>
                              Accept
                            </button>
                          )}
                          <button className="btn-secondary" onClick={() => confirmRemoveFriend(req.friendshipId, req.username, req.direction === "outgoing" ? "cancel" : "reject")}>
                            {req.direction === "outgoing" ? "Cancel" : "Reject"}
                          </button>
                        </div>
                      }
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "find" && (
            <div>
              <div className="friends-search-container">
                <svg className="search-icon" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input 
                  type="text" 
                  className="friends-search-input" 
                  placeholder="Search by username or email..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {isSearching && (
                <div style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)" }}>
                  Searching...
                </div>
              )}

              {!isSearching && debouncedQuery.trim().length >= 2 && searchResults.length === 0 && (
                <div className="empty-state">
                  <p>No users found matching "{debouncedQuery}"</p>
                </div>
              )}

              {debouncedQuery.trim().length === 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  <div className="invite-promo-card" style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
                    <h3 style={{ margin: '0 0 1rem 0', color: 'var(--brand-accent)' }}>Build Your Network</h3>
                    <p style={{ color: 'var(--text-muted)', margin: '0' }}>Search for your friends by username or email above to start splitting bills!</p>
                  </div>
                </div>
              )}

              {debouncedQuery.trim().length > 0 && debouncedQuery.trim().length < 2 && (
                <div style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)", fontSize: "0.9rem" }}>
                  Please enter at least 2 characters to search.
                </div>
              )}

              {!isSearching && searchResults.length > 0 && (
                <div className="single-column-list">
                  {searchResults.map((user) => {
                    const isCurrentUser = currentUser && (currentUser.id === user.id || currentUser._id === user.id);
                    if (isCurrentUser) return null;

                    const isAlreadyFriend = friends.some(f => f.id === user.id || (f as any)._id === user.id);
                    const outgoingReq = pendingRequests.find(pr => (pr.id === user.id || (pr as any)._id === user.id) && pr.direction === "outgoing");
                    const incomingReq = pendingRequests.find(pr => (pr.id === user.id || (pr as any)._id === user.id) && pr.direction === "incoming");
                    
                    const isSent = sentRequests.has(user.id) || !!outgoingReq;

                    let buttonLabel = "Add Friend";
                    let buttonClass = "btn-primary";
                    let disabled = false;
                    let action = () => handleAddFriend(user.id);

                    if (isAlreadyFriend) {
                      buttonLabel = "Friend";
                      buttonClass = "btn-secondary";
                      disabled = true;
                    } else if (isSent) {
                      buttonLabel = "Requested";
                      buttonClass = "btn-secondary";
                      disabled = true;
                    } else if (incomingReq) {
                      buttonLabel = "Accept Request";
                      buttonClass = "btn-primary";
                      action = () => handleAcceptFriend(incomingReq.friendshipId);
                    }

                    return (
                      <UserCard
                        key={user.id}
                        user={user}
                        actionButton={
                          <button 
                            className={buttonClass} 
                            onClick={action}
                            disabled={disabled}
                            style={disabled ? { opacity: 0.7, cursor: "not-allowed" } : {}}
                          >
                            {buttonLabel}
                          </button>
                        }
                      />
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
        </div>

        {confirmModal.isOpen && (
          <div className="friends-modal-overlay">
            <div className="friends-modal-content">
              <p style={{ fontSize: '1.15rem', textAlign: 'center', marginBottom: '1.5rem', color: 'var(--text-primary)', fontWeight: 600, fontFamily: 'Outfit, sans-serif' }}>
                {confirmModal.message}
              </p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <button className="btn-secondary" onClick={() => setConfirmModal({ isOpen: false, friendshipId: null, message: "" })}>No</button>
                <button className="btn-danger" onClick={executeRemoveFriend}>Yes</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
