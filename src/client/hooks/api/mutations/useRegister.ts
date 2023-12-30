import { useMutation } from "react-query";
import { ApiService, RequestError } from "services/ApiService";

export default function useRegister() {
  return useMutation<
    unknown,
    RequestError,
    { login: string; password: string }
  >(async (data) => {
    await ApiService.post("/register", data);
  });
}
