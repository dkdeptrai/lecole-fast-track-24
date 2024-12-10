import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "~/lib/utils";

const textFieldVariants = cva(
  "flex w-full rounded-md border bg-background px-3 py-2 text-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "border-input focus:border-primary",
        error: "border-destructive focus:border-destructive",
        success: "border-success focus:border-success",
      },
      variantSize: {
        default: "h-9",
        sm: "h-8 text-xs",
        lg: "h-10 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      variantSize: "default",
    },
  }
);

export interface TextFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    Omit<VariantProps<typeof textFieldVariants>, "size"> {
  label?: string;
}

const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
  ({ className, variant, variantSize, label, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        {label && <label className="text-sm font-medium">{label}</label>}
        <input
          className={cn(textFieldVariants({ variant, variantSize, className }))}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);
TextField.displayName = "TextField";

export { TextField, textFieldVariants };
