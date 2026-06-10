import * as React from "react";
import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={cn(
        "flex min-h-[200px] w-full rounded-md border border-input bg-background/50 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/70 focus-ring disabled:cursor-not-allowed disabled:opacity-50 leading-relaxed",
        className,
      )}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
