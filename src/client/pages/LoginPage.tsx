import { useForm } from "react-hook-form";
import useGameServer from "../hooks/useGameServer";
import { useNavigate } from "react-router";

export default function LoginPage() {
  const { connect } = useGameServer({});
  const navigate = useNavigate();

  const form = useForm<{ login: string }>();

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={form.handleSubmit((data) => {
        connect(data.login);
        navigate("matchmaking");
      })}
    >
      <label>
        <p className="font-serif text-xl font-semibold text-center">
          Your name
        </p>
        <input
          {...form.register("login")}
          className="px-2 py-1 text-center border rounded-sm outline-none"
        />
      </label>
      <button className="py-1.5 font-semibold text-blue-800 transition-transform bg-blue-200 border-2 border-blue-300 rounded-md active:translate-y-1">
        Start game
      </button>
    </form>
  );
}
