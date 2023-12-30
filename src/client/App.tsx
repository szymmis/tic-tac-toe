import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter, Route, Routes } from "react-router";
import { useAuthStore } from "stores/useAuthStore";

import GamePage from "@/pages/GamePage";
import LoginPage from "@/pages/LoginPage";
import MainMenuPage from "@/pages/MainMenuPage";
import RegisterPage from "@/pages/RegisterPage";

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false } },
});

export default function App() {
  const { user } = useAuthStore();

  return (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[user ? "/" : "/login"]}>
        <Routes>
          <Route path="/" element={<MainMenuPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/game" element={<GamePage />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  );
}
