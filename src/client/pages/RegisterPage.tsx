import { useState } from "react";
import { useNavigate } from "react-router";
import { RequestError } from "services/ApiService";
import { z } from "zod";

import Alert from "@/components/Alert";
import Button from "@/components/Button";
import Form from "@/components/Form";
import Heading from "@/components/Heading";
import Input from "@/components/Input";
import Link from "@/components/Link";
import useRegister from "@/hooks/api/mutations/useRegister";

const schema = z
  .object({
    login: z.string().min(1, { message: "Login is required" }),
    password: z.string().min(1, { message: "Password is required" }),
    confirmPassword: z
      .string()
      .min(1, { message: "You need to confirm the password" }),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "The passwords do not match",
        path: ["confirmPassword"],
      });
    }
  });

export default function RegisterPage() {
  const navigate = useNavigate();
  const { mutate: register } = useRegister();
  const [error, setError] = useState<RequestError>();

  return (
    <div>
      <Form
        className="flex flex-col gap-4"
        schema={schema}
        onValid={(data) =>
          register(data, {
            onSuccess: () => {
              console.log("success");
              navigate("/login");
            },
            onError: (err) => setError(err),
          })
        }
      >
        <Heading title="Register an account" />

        {error?.code === 400 && <Alert title="Username is already taken" />}

        <div className="flex flex-col gap-y-2">
          <Input name="login" label="Your name" required />
          <Input name="password" label="Password" required type="password" />
          <Input
            name="confirmPassword"
            label="Confirm password"
            required
            type="password"
          />
        </div>

        <Button label="Create an account" />
      </Form>
      <p className="mt-6 text-sm text-center">
        Already have an account?{" "}
        <Link to="/login">
          <b className="hover:underline">Login</b>
        </Link>
      </p>
    </div>
  );
}
