import { useState } from "react";
import { useNavigate } from "react-router";
import { RequestError } from "services/ApiService";
import { useMeStore } from "stores/useMeStore";
import { z } from "zod";

import Alert from "@/components/Alert";
import Button from "@/components/Button";
import Form from "@/components/Form";
import Heading from "@/components/Heading";
import Input from "@/components/Input";
import Link from "@/components/Link";
import useLogin from "@/hooks/api/mutations/useLogin";

const schema = z.object({
  login: z.string().min(1, { message: "Login is required" }),
  password: z.string().min(1, { message: "Password is required" }),
});

export default function LoginPage() {
  const [error, setError] = useState<RequestError>();
  const { mutate: login } = useLogin();
  const navigate = useNavigate();
  const meStore = useMeStore();

  return (
    <div>
      <Form
        className="flex flex-col items-center gap-4"
        schema={schema}
        onValid={(data) => {
          login(data, {
            onSuccess: (response) => {
              meStore.login(response);
              navigate("/");
            },
            onError: (err) => setError(err),
          });
        }}
      >
        <Heading title="Tic Tac Toe" />

        {error?.code === 404 && (
          <Alert title="User with that login and password does not exist" />
        )}

        <div className="flex flex-col gap-2">
          <Input name="login" label="Your name" required />
          <Input name="password" label="Password" required type="password" />
          <Button label="Login" className="w-full mt-2" />
        </div>
      </Form>

      <p className="mt-6 text-sm text-center">
        Do not have an account yet?{" "}
        <Link to="/register">
          <b className="hover:underline">Register</b>
        </Link>
      </p>
    </div>
  );
}
