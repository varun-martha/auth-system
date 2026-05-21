import { render, screen } from "@testing-library/react";

import { DashboardProfileCard } from "@/components/auth/DashboardProfileCard";

describe("DashboardProfileCard", () => {
  it("renders the authenticated user details", () => {
    render(
      <DashboardProfileCard
        user={{
          id: "123",
          username: "janedoe",
          email: "jane@example.com"
        }}
      />
    );

    expect(screen.getByText("janedoe")).toBeInTheDocument();
    expect(screen.getByText("jane@example.com")).toBeInTheDocument();
  });
});
