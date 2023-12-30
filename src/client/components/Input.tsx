import clsx from "clsx";
import { InputHTMLAttributes } from "react";
import { useFormContext } from "react-hook-form";

type InputProps = {
  name: string;
  label?: string;
  required?: boolean;
} & InputHTMLAttributes<HTMLInputElement>;

export default function Input({ name, label, required, ...props }: InputProps) {
  const form = useFormContext();

  const error = form.formState.errors[name];

  return (
    <label className="w-full">
      {label && (
        <p
          className={clsx(
            "font-serif font-semibold",
            required && "after:content-['*'] after:text-red-600",
          )}
        >
          {label}
        </p>
      )}
      <input
        {...props}
        {...form.register(name)}
        required={required}
        className={clsx(
          "px-3 py-2 border-2 rounded-md w-full outline-none text-sm",
          error && "border-red-400 bg-red-100",
        )}
      />
      {error && (
        <p className="mt-0.5 text-xs font-semibold text-red-400">
          {error.message?.toString()}
        </p>
      )}
    </label>
  );
}
