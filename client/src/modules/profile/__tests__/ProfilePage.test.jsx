import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ProfilePage from "../ProfilePage";
import { updateUserProfile } from "../../../features/auth/authSlice";
import * as profileService from "../services/profileService";
import * as fileService from "../../../services/fileService";

vi.mock("../services/profileService", () => ({
  updateProfile: vi.fn(),
  deleteProfile: vi.fn(),
  uploadAvatar: vi.fn(),
  removeAvatar: vi.fn(),
}));

vi.mock("../../../services/fileService", () => ({
  getSignedFileUrl: vi.fn(),
}));

const baseUser = {
  id: "user-1",
  name: "Aarav Sharma",
  email: "aarav@example.com",
  role: "student",
  provider: "email",
  isVerified: true,
  createdAt: "2025-01-01T00:00:00.000Z",
  updatedAt: "2025-01-02T00:00:00.000Z",
  profilePic: null,
};

const createStore = (user = baseUser) =>
  configureStore({
    reducer: {
      auth: (state = { user, token: "test-token", isAuthenticated: true }, action) => {
        if (action.type === updateUserProfile.type) {
          return { ...state, user: action.payload };
        }
        if (action.type === "auth/logout") {
          return { ...state, user: null, token: null, isAuthenticated: false };
        }
        return state;
      },
    },
  });

const renderProfile = (user = baseUser) =>
  render(
    <Provider store={createStore(user)}>
      <MemoryRouter>
        <ProfilePage />
      </MemoryRouter>
    </Provider>,
  );

const imageFile = (name = "avatar.png", type = "image/png", size = 1024) =>
  new File(["a".repeat(size)], name, { type });

describe("ProfilePage avatar upload", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    let blobId = 0;
    URL.createObjectURL = vi.fn(() => `blob:avatar-${++blobId}`);
    URL.revokeObjectURL = vi.fn();
    fileService.getSignedFileUrl.mockResolvedValue("https://cdn.example.com/avatar.png");
    profileService.uploadAvatar.mockResolvedValue({
      success: true,
      user: { ...baseUser, profilePic: "avatars/avatar.png" },
    });
  });

  it("renders a default avatar when no image exists", () => {
    renderProfile();

    expect(screen.getByLabelText(/aarav sharma default avatar/i)).toBeInTheDocument();
    expect(screen.queryByAltText(/profile avatar/i)).not.toBeInTheDocument();
    expect(screen.getByLabelText(/upload profile image/i)).toBeInTheDocument();
    expect(screen.getByText(/upload photo/i)).toBeInTheDocument();
  });

  it("shows an uploaded image preview immediately", async () => {
    const user = userEvent.setup();
    renderProfile();

    await act(async () => {
      await user.upload(screen.getByLabelText(/upload profile image/i), imageFile());
    });

    expect(await screen.findByAltText(/aarav sharma profile avatar/i)).toHaveAttribute(
      "src",
      "blob:avatar-1",
    );
    expect(screen.getByRole("button", { name: /save photo/i })).toBeInTheDocument();
  });

  it("rejects unsupported file types", async () => {
    const user = userEvent.setup({ applyAccept: false });
    renderProfile();

    await act(async () => {
      await user.upload(
        screen.getByLabelText(/upload profile image/i),
        new File(["bad"], "avatar.gif", { type: "image/gif" }),
      );
    });

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Please upload a PNG, JPG, JPEG, or WEBP image.",
    );
    expect(profileService.uploadAvatar).not.toHaveBeenCalled();
    expect(screen.queryByRole("button", { name: /save photo/i })).not.toBeInTheDocument();
  });

  it("handles upload loading state", async () => {
    const user = userEvent.setup();
    let resolveUpload;
    profileService.uploadAvatar.mockReturnValue(
      new Promise((resolve) => {
        resolveUpload = resolve;
      }),
    );

    renderProfile();

    await act(async () => {
      await user.upload(screen.getByLabelText(/upload profile image/i), imageFile());
    });
    const saveButton = screen.getByRole("button", { name: /save photo/i });
    await act(async () => {
      await user.click(saveButton);
    });

    expect(await screen.findByRole("button", { name: /uploading/i })).toBeDisabled();
    expect(screen.getAllByText(/uploading/i).length).toBeGreaterThan(0);

    await act(async () => {
      resolveUpload({
        success: true,
        user: { ...baseUser, profilePic: "avatars/avatar.png" },
      });
    });

    await waitFor(() => {
      expect(screen.queryByRole("button", { name: /uploading/i })).not.toBeInTheDocument();
    });
  });

  it("loads an existing avatar and replaces it with a new preview", async () => {
    const user = userEvent.setup();
    renderProfile({ ...baseUser, profilePic: "avatars/existing.png" });

    expect(await screen.findByAltText(/aarav sharma profile avatar/i)).toHaveAttribute(
      "src",
      "https://cdn.example.com/avatar.png",
    );

    await act(async () => {
      await user.upload(screen.getByLabelText(/upload profile image/i), imageFile("new.webp", "image/webp"));
    });

    expect(screen.getByAltText(/aarav sharma profile avatar/i)).toHaveAttribute(
      "src",
      "blob:avatar-1",
    );

    await act(async () => {
      await user.click(screen.getByRole("button", { name: /save photo/i }));
    });

    await waitFor(() => {
      expect(profileService.uploadAvatar).toHaveBeenCalledWith(
        expect.objectContaining({ name: "new.webp", type: "image/webp" }),
        "test-token",
      );
    });
  });
});
