import clsx from "clsx";

import Loader from "./Loader";

export default function Button({
  label,
  disabled,
  loading,
  loader,
  className,
  variant = "primary",
  onClick,
}: {
  label: string;
  disabled?: boolean;
  loading?: boolean;
  loader?: boolean;
  className?: string;
  variant?: "primary" | "secondary";
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={clsx(
        className,
        "flex items-center justify-center gap-2 px-3 py-2 text-sm font-semibold transition-all rounded-md shadow-sm active:translate-y-1  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
        variant === "primary" &&
          "bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:outline-indigo-600",
        variant === "secondary" && "bg-indigo-100 text-indigo-600",
      )}
    >
      {label}
      {(loading || loader) && <Loader size={16} color="white" />}
    </button>
  );
}
