export function getFrontendEnv() {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  if (!apiBaseUrl) {
    throw new Error(
      "Missing required frontend environment variable: NEXT_PUBLIC_API_BASE_URL"
    );
  }

  if (!googleClientId) {
    throw new Error(
      "Missing required frontend environment variable: NEXT_PUBLIC_GOOGLE_CLIENT_ID"
    );
  }

  return {
    apiBaseUrl,
    googleClientId
  };
}
