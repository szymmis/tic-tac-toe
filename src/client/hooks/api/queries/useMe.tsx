import { useQuery } from "react-query";
import { ApiService } from "services/ApiService";

export default function useMe() {
  return useQuery<{ id: number; username: string }>("/me", async () => {
    return ApiService.get("/me");
  });
}
