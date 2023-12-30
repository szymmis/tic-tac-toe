import { useMutation } from "react-query";
import { ApiService, RequestError } from "services/ApiService";
import { useAuthStore } from "stores/useAuthStore";

export default function useLogin() {
  const { login } = useAuthStore();

  return useMutation<
    { id: number; username: string },
    RequestError,
    { login: string; password: string }
  >(async (data) => {
    const user = await ApiService.post("/login", data);
    login(user);
    return user;
  });
}
