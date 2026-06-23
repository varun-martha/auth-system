"use client";
import { GroupBalance } from "@/types/groups.types";

interface Props {
  balances: GroupBalance[];
  isSettled: boolean;
  currentUserId: string;
}

export function BalanceSummary({ balances, isSettled, currentUserId }: Props) {
  if (isSettled || balances.length === 0) {
    return (
      <div className="balance-card settled-state" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1rem" }}>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ opacity: 0.8 }}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 style={{ margin: 0, fontSize: "1.2rem" }}>All settled up 🎉</h3>
        <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "0.9rem" }}>No one owes anything in this group.</p>
      </div>
    );
  }

  return (
    <div className="balance-card">
      <h2 style={{ margin: "0 0 1.5rem 0", fontSize: "1.25rem" }}>Balances</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {balances.map((balance, i) => {
          const isUserOwed = balance.toUserId === currentUserId;
          const isUserOwes = balance.fromUserId === currentUserId;
          const formatMoney = (amount: number) => `₹${(amount / 100).toFixed(2)}`;

          let text;
          let amountClass = "";
          if (isUserOwed) {
            text = <><span style={{ fontWeight: 600 }}>@{balance.fromUsername}</span> owes you</>;
            amountClass = "balance-amount-positive";
          } else if (isUserOwes) {
            text = <>You owe <span style={{ fontWeight: 600 }}>@{balance.toUsername}</span></>;
            amountClass = "balance-amount-negative";
          } else {
            text = <><span style={{ fontWeight: 600 }}>@{balance.fromUsername}</span> owes <span style={{ fontWeight: 600 }}>@{balance.toUsername}</span></>;
          }

          return (
            <div key={i} className="balance-row">
              <div style={{ fontSize: "0.95rem" }}>{text}</div>
              <div className={amountClass || "balance-amount-neutral"}>{formatMoney(balance.amount)}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
