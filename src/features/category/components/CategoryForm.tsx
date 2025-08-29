import type { CategoryFormValues } from "../schema";
import type { ICategory } from "@/entities/category";
import { useEffect, type FC, type ReactNode } from "react";

import { Switch, TextField } from "@adobe/react-spectrum";
import { Controller, useForm, type UseFormReturn } from "react-hook-form";
import { Form } from "react-router-dom";

const defaultValues: CategoryFormValues = {
  name: "",
  is_active: true,
};

export const CategoryForm: FC<{
  onSubmit: (values: CategoryFormValues) => void;
  categoryData?: ICategory;
  isPending: boolean;
  actions: (form: UseFormReturn<CategoryFormValues>) => ReactNode;
}> = (props) => {
  const { onSubmit, categoryData, isPending, actions } = props;

  const form = useForm<CategoryFormValues>({
    disabled: isPending,
    defaultValues,
  });

  useEffect(() => {
    if (categoryData) {
      form.reset({
        name: categoryData.name,
        is_active: categoryData.is_active,
      });
    } else {
      form.reset(defaultValues);
    }
  }, [form, categoryData]);

  return (
    <Form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-2.5"
    >
      <Controller
        control={form.control}
        name="name"
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            label="Name"
            width="100%"
            errorMessage={fieldState.error?.message}
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
      {actions(form)}
    </Form>
  );
};
