import { useNavigate } from "react-router";
import { z } from "zod";

import Button from "@/components/Button";
import Form from "@/components/Form";
import Input from "@/components/Input";
import Link from "@/components/Link";

const schema = z.object({
  login: z.string().min(1, { message: "Login is required" }),
  password: z.string().min(1, { message: "Password is required" }),
});

export default function LoginPage() {
  const navigate = useNavigate();

  return (
    <div>
      <Form
        className="flex flex-col items-center gap-4"
        schema={schema}
        onValid={() => {
          navigate("/");
        }}
      >
        <h1 className="mb-2 font-serif text-4xl font-bold text-center">
          Tic Tac Toe
        </h1>
        <div className="flex flex-col gap-2">
          <Input name="login" label="Your name" required />
          <Input name="password" label="Password" required type="password" />
        </div>
        <Button label="Login" />
      </Form>

      <p className="mt-6 text-sm">
        Do not have an account yet?{" "}
        <Link to="/register">
          <b className="hover:underline">Register</b>
        </Link>
      </p>
    </div>
  );
}
