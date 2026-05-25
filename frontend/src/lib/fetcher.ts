export async function fetchJson<T>(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<T> {
  const response = await fetch(input, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {})
    }
  });

  const body = await response.json().catch(() => null);
  console.warn("response:", response);

  if (!response.ok) {
    throw new Error(body?.message || "Request failed.");
  }

  return body as T;
}
