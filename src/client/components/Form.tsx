import { zodResolver } from "@hookform/resolvers/zod";
import { ReactNode } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { ZodType, z } from "zod";

export default function Form<T extends ZodType>({
  schema,
  onValid,
  children,
  className,
}: {
  schema: T;
  onValid: SubmitHandler<z.infer<T>>;
  className?: string;
  children: ReactNode;
}) {
  const form = useForm({ resolver: zodResolver(schema) });

  return (
    <FormProvider {...form}>
      <form
        className={className}
        onSubmit={form.handleSubmit(
          (data) => onValid(data),
          (errs) => console.error(errs)
        )}
      >
        {children}
      </form>
    </FormProvider>
  );
}
