"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Minimal Slot pattern (Radix-style).
 * When `asChild` is true, Button merges its styles into its single child
 * and forwards the ref/props to it. This lets us use <Button asChild><Link/></Button>.
 */
const Slot = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ children, ...slotProps }, forwardedRef) => {
    if (!React.isValidElement(children)) {
      return null;
    }
    return React.cloneElement(
      children,
      {
        ...slotProps,
        ...(children.props as Record<string, unknown>),
        className: cn(
          (slotProps.className as string) ?? "",
          (children.props as { className?: string }).className ?? "",
        ),
        ref: forwardedRef
          ? mergeRefs(forwardedRef, (children as { ref?: React.Ref<HTMLElement> }).ref)
          : (children as { ref?: React.Ref<HTMLElement> }).ref,
      } as Record<string, unknown>,
    );
  },
);
Slot.displayName = "Slot";

function mergeRefs<T>(...refs: (React.Ref<T> | undefined)[]): React.RefCallback<T> {
  return (node) => {
    for (const ref of refs) {
      if (!ref) continue;
      if (typeof ref === "function") ref(node);
      else (ref as React.MutableRefObject<T | null>).current = node;
    }
  };
}

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 focus-ring select-none",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_1px_0_0_hsl(0_0%_100%/0.1)_inset,0_0_0_1px_hsl(221_83%_60%/0.4)]",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border",
        outline:
          "border border-border bg-transparent text-foreground hover:bg-secondary/60",
        ghost: "text-foreground hover:bg-secondary/60",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        gradient:
          "text-white shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 [background:linear-gradient(135deg,hsl(221_83%_60%)_0%,hsl(262_83%_65%)_100%)] hover:[background:linear-gradient(135deg,hsl(221_83%_65%)_0%,hsl(262_83%_70%)_100%)]",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-12 rounded-lg px-6 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild, ...props }, ref) => {
    const Comp = (asChild ? Slot : "button") as React.ElementType;
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
