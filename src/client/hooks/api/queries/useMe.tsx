import { useQuery } from "react-query";
import { useNavigate } from "react-router";
import { ApiService, RequestError } from "services/ApiService";
import { useAuthStore } from "stores/useAuthStore";

export default function useMe() {
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  return useQuery<{ id: number; username: string }>("/me", async () => {
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
