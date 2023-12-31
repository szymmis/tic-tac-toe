import { useMutation } from "react-query";
import { ApiService, RequestError } from "services/ApiService";
import { useAuthStore } from "stores/useAuthStore";

import useMe from "@/hooks/api/queries/useMe";

export default function useLogin() {
  const { login } = useAuthStore();
  const { refetch } = useMe();

  return useMutation<
    { id: number; username: string },
    RequestError,
    { login: string; password: string }
  >(async (data) => {
    const user = await ApiService.post("/login", data);
    await refetch();
    login(user);
    return user;
  });
}
