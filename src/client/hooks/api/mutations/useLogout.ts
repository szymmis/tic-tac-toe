import { useMutation } from "react-query";
import { ApiService, RequestError } from "services/ApiService";
import { useAuthStore } from "stores/useAuthStore";

export default function useLogout() {
  const { logout } = useAuthStore();

  return useMutation<void, RequestError>(async () => {
    await ApiService.post("/logout", {});
    logout();
  });
}
