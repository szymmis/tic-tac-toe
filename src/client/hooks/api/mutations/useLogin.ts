import { useMutation } from "react-query";
import { ApiService, RequestError } from "services/ApiService";

export default function useLogin() {
  return useMutation<
    { id: number; username: string },
    RequestError,
    { login: string; password: string }
  >(async (data) => {
    return ApiService.post("/login", data);
  });
}
