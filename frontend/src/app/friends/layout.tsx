import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Friends | PaySplit",
  description: "Connect with friends, manage requests, and expand your PaySplit network.",
};

export default function FriendsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
