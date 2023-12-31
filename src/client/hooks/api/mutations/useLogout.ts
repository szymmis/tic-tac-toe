import { useMutation } from "react-query";
import { ApiService, RequestError } from "services/ApiService";
import { useAuthStore } from "stores/useAuthStore";

import useGameServer from "@/hooks/useGameServer";

export default function useLogout() {
  const { logout } = useAuthStore();
  const { disconnect } = useGameServer({});

  return useMutation<void, RequestError>(async () => {
    await ApiService.post("/logout", {});
    logout();
    disconnect();
  });
}
