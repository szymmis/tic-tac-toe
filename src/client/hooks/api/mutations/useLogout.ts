import { useMutation } from "react-query";
import { ApiService, RequestError } from "services/ApiService";
import { useMeStore } from "stores/useMeStore";

export default function useLogout() {
  const { logout } = useMeStore();

  return useMutation<void, RequestError>(async () => {
    await ApiService.post("/logout", {});
    logout();
  });
}
