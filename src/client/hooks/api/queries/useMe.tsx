import { useQuery } from "react-query";
import { useNavigate } from "react-router";
import { ApiService, RequestError } from "services/ApiService";
import { useAuthStore } from "stores/useAuthStore";

export type HistoryEntry = {
  id: number;
  x_id: number;
  x_username: string;
  o_id: number;
  o_username: string;
  winner_id: number;
  started_at: string;
  finished_at: string;
};

export default function useMe() {
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  return useQuery<{
    user: { id: number; username: string };
    history: HistoryEntry[];
  }>("/me", async () => {
    try {
      return await ApiService.get("/me");
    } catch (err) {
      if (err instanceof RequestError) {
        if (err.code === 401) {
          logout();
          navigate("/login");
        } else {
          console.error(err);
        }
      }
    }
  });
}
