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
  }
};
