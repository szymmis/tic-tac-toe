export default function Alert({ title }: { title: string }) {
  return (
    <p className="px-2 py-2 text-sm font-medium text-red-600 bg-red-100 rounded-md">
      ❗ {title}
    </p>
  );
}
