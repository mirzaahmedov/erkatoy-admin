import type { TagFormValues } from "../schema";
import type { ITag } from "@/entities/tag";
import { useEffect, type FC, type ReactNode } from "react";

import { TextField } from "@adobe/react-spectrum";
import { Controller, useForm, type UseFormReturn } from "react-hook-form";
import { Form } from "react-router-dom";

const defaultValues: TagFormValues = {
  name: "",
};

export const TagForm: FC<{
  onSubmit: (values: TagFormValues) => void;
  tagData?: ITag;
  isPending: boolean;
  actions: (form: UseFormReturn<TagFormValues>) => ReactNode;
}> = (props) => {
  const { onSubmit, tagData, isPending, actions } = props;

  const form = useForm<TagFormValues>({
    disabled: isPending,
    defaultValues,
  });

  useEffect(() => {
    if (tagData) {
      form.reset({
        name: tagData.name,
      });
    } else {
      form.reset(defaultValues);
    }
  }, [form, tagData]);

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
      {actions(form)}
    </Form>
  );
};
