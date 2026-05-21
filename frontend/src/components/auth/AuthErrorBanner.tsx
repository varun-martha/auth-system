export function AuthErrorBanner({ message }: { message: string | null }) {
  if (!message) {
    return null;
  }

  return <div className="auth-banner">{message}</div>;
}
