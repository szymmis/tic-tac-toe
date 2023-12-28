import Loader from "./Loader";

export default function Button({
  label,
  disabled,
  loading,
  onClick,
}: {
  label: string;
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className="flex items-center justify-center w-full gap-2 px-3 py-2 text-sm font-semibold text-white transition-all bg-indigo-600 rounded-md shadow-sm active:translate-y-1 hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
    >
      {label}
      {loading && <Loader size={16} color="white" />}
    </button>
  );
}
