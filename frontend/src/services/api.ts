const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export const api = {
  post: async (endpoint: string, body: any) => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "API Error");
    }
    return data;
  },
  get: async (endpoint: string) => {
    const response = await fetch(`${API_URL}${endpoint}`);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "API Error");
    }
    return data;
  }
};
