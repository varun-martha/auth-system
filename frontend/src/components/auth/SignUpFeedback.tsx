export function SignUpFeedback({ message }: { message: string | null }) {
  return <p className="auth-feedback">{message}</p>;
}
