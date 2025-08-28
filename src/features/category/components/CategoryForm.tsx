import type { CategoryFormValues } from "../schema";
import type { FC } from "react";
import { Button, Switch, TextField } from "@adobe/react-spectrum";
import { Controller, useForm } from "react-hook-form";
import { Form } from "react-router-dom";

export const CategoryForm: FC<{
  onSubmit: (values: CategoryFormValues) => void;
  isPending: boolean;
}> = (props) => {
  const { onSubmit, isPending } = props;

  const form = useForm<CategoryFormValues>({
    defaultValues: {
      name: "",
      is_active: true,
    },
  });

  return (
    <Form onSubmit={form.handleSubmit(onSubmit)}>
      <h1 className="text-4xl">Create Category</h1>
      <Controller
        control={form.control}
        name="name"
        render={({ field }) => (
          <TextField
            {...field}
            label="Name"
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
      <Button
        type="submit"
        style="fill"
        variant="accent"
        isDisabled={isPending}
        isPending={isPending}
      >
        Continue
      </Button>
    </Form>
  );
};
