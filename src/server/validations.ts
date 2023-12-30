import { z } from "zod";

const Login = z.object({ login: z.string(), password: z.string() });
const Register = z.object({ login: z.string(), password: z.string() });

export const Validations = { Login, Register };
