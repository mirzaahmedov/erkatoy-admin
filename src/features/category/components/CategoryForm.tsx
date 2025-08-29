import type { CategoryFormValues } from "../schema";
import type { FC, ReactNode } from "react";
import { Switch, TextField } from "@adobe/react-spectrum";
import { Controller, useForm } from "react-hook-form";
import { Form } from "react-router-dom";

export const CategoryForm: FC<{
  onSubmit: (values: CategoryFormValues) => void;
  isPending: boolean;
  actions: ReactNode;
}> = (props) => {
  const { onSubmit, isPending, actions } = props;

  const form = useForm<CategoryFormValues>({
    disabled: isPending,
    defaultValues: {
      name: "",
      is_active: true,
    },
  });

  return (
    <Form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-2.5"
    >
      <Controller
        control={form.control}
        name="name"
        render={({ field }) => (
          <TextField
            {...field}
            label="Name"
            width="100%"
          />
        )}
      />
      <Controller
        control={form.control}
        name="is_active"
        render={({ field }) => (
          <Switch
            ref={field.ref}
            isSelected={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            name={field.name}
          >
            Is Active
          </Switch>
        )}
      />
      {actions}
    </Form>
  );
};
