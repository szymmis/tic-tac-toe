import { create } from "zustand";
import { persist } from "zustand/middleware";

type User = { id: number; username: string };

export const useAuthStore = create(
  persist<{
    user: User | undefined;
    login: (user: User) => void;
    logout: () => void;
  }>(
    (set) => ({
      user: undefined,
      login: (user: User) => set({ user }),
      logout: () => set({ user: undefined }),
    }),
    { name: "me-store" },
  ),
);
