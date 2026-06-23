import { fetchJson } from "@/lib/fetcher";
import { buildApiUrl } from "@/services/auth-api.service";

export const api = {
  searchUsers: async (query: string) => {
    const data = await fetchJson<any>(buildApiUrl(`/users/search?q=${encodeURIComponent(query)}`), {
      method: "GET"
    });
    return data.users;
  },
  getFriends: async () => {
    return fetchJson<any>(buildApiUrl("/friends"), {
      method: "GET",
      cache: "no-store"
    });
  },
  removeFriend: async (friendshipId: string) => {
    return fetchJson<any>(buildApiUrl(`/friends/${friendshipId}`), {
      method: "DELETE"
    });
  },
  sendFriendRequest: async (targetUserId: string) => {
    return fetchJson<any>(buildApiUrl("/friends/request"), {
      method: "POST",
      body: JSON.stringify({ targetUserId })
    });
  },
  acceptFriendRequest: async (friendshipId: string) => {
    return fetchJson<any>(buildApiUrl("/friends/accept"), {
      method: "POST",
      body: JSON.stringify({ friendshipId })
    });
  },
  getCurrentUser: async () => {
    return fetchJson<any>(buildApiUrl("/auth/me"), {
      method: "GET",
      cache: "no-store"
    });
  },
  getDashboardSummary: async () => {
    return fetchJson<any>(buildApiUrl("/users/me/dashboard"), {
      method: "GET",
      cache: "no-store"
    });
  },
  getActivityHistory: async (limit = 50, before?: string) => {
    const query = new URLSearchParams({ limit: limit.toString() });
    if (before) query.append("before", before);
    return fetchJson<any>(buildApiUrl(`/users/me/activity?${query.toString()}`), {
      method: "GET",
      cache: "no-store"
    });
  },
  getGroups: async () => {
    return fetchJson<any>(buildApiUrl("/groups"), { method: "GET", cache: "no-store" });
  },
  createGroup: async (payload: { name: string; description?: string; memberIds?: string[] }) => {
    return fetchJson<any>(buildApiUrl("/groups"), {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  getGroup: async (groupId: string) => {
    return fetchJson<any>(buildApiUrl(`/groups/${groupId}`), { method: "GET", cache: "no-store" });
  },
  addGroupMembers: async (groupId: string, memberIds: string[]) => {
    return fetchJson<any>(buildApiUrl(`/groups/${groupId}/members`), {
      method: "POST",
      body: JSON.stringify({ memberIds }),
    });
  },
  getGroupBalances: async (groupId: string) => {
    return fetchJson<any>(buildApiUrl(`/groups/${groupId}/balances`), { method: "GET", cache: "no-store" });
  },
  getGroupExpenses: async (groupId: string) => {
    return fetchJson<any>(buildApiUrl(`/groups/${groupId}/expenses`), { method: "GET", cache: "no-store" });
  },
  createExpense: async (groupId: string, payload: any) => {
    return fetchJson<any>(buildApiUrl(`/groups/${groupId}/expenses`), {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  updateExpense: async (groupId: string, expenseId: string, payload: any) => {
    return fetchJson<any>(buildApiUrl(`/groups/${groupId}/expenses/${expenseId}`), {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },
  createDirectSplit: async (payload: any) => {
    return fetchJson<any>(buildApiUrl("/splits/direct"), {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }
};
