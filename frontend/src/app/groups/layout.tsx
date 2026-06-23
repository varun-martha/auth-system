import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Groups | PaySplit",
  description: "Create groups, split expenses, and track who owes what with your friends.",
};

export default function GroupsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
