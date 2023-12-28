import useGameServer from "../hooks/useGameServer";
import { useNavigate } from "react-router";
import Button from "../components/Button";
import { z } from "zod";
import Input from "../components/Input";
import Form from "../components/Form";
import Link from "../components/Link";

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

  return (
    <div>
      <Form
        className="flex flex-col gap-4"
        schema={schema}
        onValid={(data) => {
          navigate("/login");
        }}
      >
        <h1 className="mb-2 font-serif text-4xl font-bold text-center">
          Register an account
        </h1>
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
