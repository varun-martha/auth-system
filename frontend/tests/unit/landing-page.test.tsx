import { render, screen } from "@testing-library/react";

import LandingPage from "@/app/(marketing)/page";

describe("LandingPage", () => {
  it("shows marketing CTA links", () => {
    render(<LandingPage />);

    expect(screen.getByText(/launch a clean, secure sign-in experience/i)).toBeInTheDocument();
  });
});
