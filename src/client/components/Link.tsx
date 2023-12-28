import { ReactNode } from "react";
import { useNavigate } from "react-router";

export default function Link({
  to,
  children,
}: {
  to: string;
  children: ReactNode;
}) {
  const navigate = useNavigate();

  return <button onClick={() => navigate(to)}>{children}</button>;
}
