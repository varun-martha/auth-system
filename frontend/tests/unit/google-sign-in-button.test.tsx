import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";

vi.mock("@/lib/env", () => ({
  getFrontendEnv: () => ({
    apiBaseUrl: "http://localhost",
    googleClientId: "test-google-client-id"
  })
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn()
  })
}));

import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";

describe("GoogleSignInButton", () => {
  beforeEach(() => {
    window.google = {
      accounts: {
        id: {
          initialize: vi.fn(),
          renderButton: vi.fn()
        }
      }
    } as any;
  });

  afterEach(() => {
    delete window.google;
    vi.restoreAllMocks();
  });

  it("initializes Google Identity Services and renders the Google button", async () => {
    render(<GoogleSignInButton />);

    await waitFor(() => {
      expect(window.google?.accounts?.id?.initialize).toHaveBeenCalledWith(
        expect.objectContaining({
          client_id: "test-google-client-id"
        })
      );
    });

    expect(window.google?.accounts?.id?.renderButton).toHaveBeenCalled();
  });
});
