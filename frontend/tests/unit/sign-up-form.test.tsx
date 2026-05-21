import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

import { SignUpForm } from "@/components/auth/SignUpForm";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn()
  })
}));

describe("SignUpForm", () => {
  it("renders username, email, and password fields", () => {
    render(<SignUpForm />);

    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });
});
