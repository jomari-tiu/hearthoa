"use client";

import * as React from "react";
import { Textarea as UITextarea, type TextareaProps as UITextareaProps } from "@/components/ui/textarea";

export type TextareaProps = UITextareaProps & {
  invalid?: boolean;
};

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { invalid, className, ...rest },
  ref,
) {
  return <UITextarea ref={ref} aria-invalid={invalid || undefined} className={className} {...rest} />;
});
