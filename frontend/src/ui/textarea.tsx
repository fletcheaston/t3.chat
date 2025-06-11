import * as React from "react";

import { cn } from "@/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
    return (
        <textarea
            data-slot="textarea"
            rows={1}
            className={cn(
                "placeholder:text-silver-dull flex field-sizing-content min-h-16 w-full resize-none text-base transition-[color,box-shadow] outline-none disabled:cursor-not-allowed disabled:opacity-50",
                className
            )}
            {...props}
        />
    );
}

export { Textarea };
