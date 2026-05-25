"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { LogoutButton } from "./auth/LogoutButton";

export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Close sidebar on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const navItems = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "My Profile", href: "/profile" }
  ];

  return (
    <>
      <button
        className="mobile-hamburger"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Menu"
      >
        <span style={{ transform: isOpen ? "rotate(45deg)" : "rotate(0)" }} />
        <span style={{ opacity: isOpen ? 0 : 1 }} />
        <span style={{ transform: isOpen ? "rotate(-45deg)" : "rotate(0)" }} />
      </button>

      <div
        className={`sidebar-overlay ${isOpen ? "open" : ""}`}
        onClick={() => setIsOpen(false)}
      />

      <aside
        style={{
          width: "250px",
          height: "100vh",
          borderRight: "1px solid var(--border-subtle)",
          padding: "2rem 1rem",
          backgroundColor: "var(--panel-background)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          display: "flex",
          flexDirection: "column",
          zIndex: 40
        }}
        className={`sidebar-container ${isOpen ? "open" : ""}`}
      >
        <h2
          style={{
            paddingLeft: "1rem",
            marginBottom: "2rem",
            color: "var(--text-primary)",
            fontFamily: "Outfit, sans-serif",
            letterSpacing: "0.1em",
            fontWeight: 800
          }}
        >
          <span style={{ color: "var(--text-primary)" }}>PAY</span>
          <span style={{ color: "var(--brand-accent)" }}>SPLIT</span>
        </h2>

        <nav
          style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
        >
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  padding: "0.75rem 1rem",
                  borderRadius: "6px",
                  textDecoration: "none",
                  color: isActive ? "var(--brand-accent)" : "var(--text-muted)",
                  backgroundColor: isActive
                    ? "var(--brand-accent-glow)"
                    : "transparent",
                  fontWeight: isActive ? 600 : 400,
                  transition: "all 0.3s ease"
                }}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div style={{ marginTop: "auto", paddingTop: "1rem" }}>
          <LogoutButton />
        </div>
      </aside>
    </>
  );
}
