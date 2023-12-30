import { useMutation } from "react-query";
import { ApiService, RequestError } from "services/ApiService";
import { useMeStore } from "stores/useMeStore";

export default function useLogin() {
  const { login } = useMeStore();

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
