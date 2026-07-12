"use client";

import * as React from "react";
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import type { Section } from "../types/section";
import { sectionSchema, type SectionFormData } from "../schemas/section-schema";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

type SectionFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Section | null;
  onSubmit: (values: SectionFormData) => Promise<void> | void;
  isSubmitting?: boolean;
};

export function SectionFormDialog({
  open,
  onOpenChange,
  initialData,
  onSubmit,
  isSubmitting = false,
}: SectionFormDialogProps) {
  const isEdit = !!initialData;

  const form = useForm<SectionFormData>({
    resolver: zodResolver(sectionSchema),
    defaultValues: {
      title: "",
      sort_order: 0,
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        title: initialData?.title ?? "",
        sort_order: initialData?.sort_order ?? 0,
      });
    }
  }, [open, initialData, form]);

  const handleSubmit = async (values: SectionFormData) => {
    await onSubmit(values);
    onOpenChange(false);
    form.reset({
      title: "",
      sort_order: 0,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "ویرایش سکشن" : "ایجاد سکشن جدید"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>عنوان سکشن</FormLabel>
                  <FormControl>
                    <Input placeholder="مثلاً: فصل اول" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sort_order"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ترتیب نمایش</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0"
                      {...field}
                      value={field.value ?? 0}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === "" ? 0 : Number(e.target.value),
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                انصراف
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? "در حال ذخیره..."
                  : isEdit
                    ? "ذخیره تغییرات"
                    : "ایجاد سکشن"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
