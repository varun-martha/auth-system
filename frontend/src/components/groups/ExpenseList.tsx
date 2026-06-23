"use client";
import { Expense } from "@/types/groups.types";

const methodLabel: Record<string, string> = { equal: "Split equally", custom: "Custom split", percentage: "By percentage", settlement: "Settlement" };

interface Props {
  expenses: Expense[];
  onAddExpense: () => void;
  onEditExpense?: (expense: Expense) => void;
}

export function ExpenseList({ expenses, onAddExpense, onEditExpense }: Props) {
  if (expenses.length === 0) {
    return (
      <div className="empty-state">
        <svg width="40" height="40" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ margin: "0 auto 1rem", opacity: 0.5 }}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
        <h3>No expenses yet</h3>
        <p>Add the first expense to start tracking splits.</p>
        <button id="add-first-expense" className="btn-primary" style={{ marginTop: "1rem" }} onClick={onAddExpense}>Add Expense</button>
      </div>
    );
  }
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      {expenses.map((expense) => {
        if (expense.splitMethod === "settlement") {
          return (
            <div key={expense.id} className="expense-card" style={{ borderColor: "rgba(16, 185, 129, 0.3)" }}>
              <div className="expense-card-header">
                <span className="expense-card-title" style={{ color: "var(--brand-accent)" }}>
                  @{expense.paidByName} paid @{expense.splits?.[0]?.username || "someone"}
                </span>
                <span className="expense-card-amount" style={{ color: "var(--brand-accent)" }}>₹{(expense.totalAmount / 100).toFixed(2)}</span>
              </div>
              <div className="expense-card-meta">
                <span>{new Date(expense.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                <span className="expense-method-chip" style={{ background: "rgba(16, 185, 129, 0.15)", color: "var(--brand-accent)" }}>Payment</span>
              </div>
            </div>
          );
        }
        
        return (
          <div key={expense.id} className="expense-card">
            <div className="expense-card-header">
              <span className="expense-card-title">{expense.title}</span>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span className="expense-card-amount">₹{(expense.totalAmount / 100).toFixed(2)}</span>
                {onEditExpense && (
                  <button 
                    onClick={() => onEditExpense(expense)}
                    style={{ background: "none", border: "none", cursor: "pointer", color: "var(--brand-accent)", padding: "0" }}
                    title="Edit expense"
                    aria-label="Edit expense"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                  </button>
                )}
              </div>
            </div>
            <div className="expense-card-meta">
              <span>Paid by @{expense.paidByName}</span>
              <span>{new Date(expense.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
              <span className="expense-method-chip">{methodLabel[expense.splitMethod] || expense.splitMethod}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
