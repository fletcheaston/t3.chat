import * as React from "react";

import { Slot } from "@radix-ui/react-slot";
import { type VariantProps, cva } from "class-variance-authority";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/ui/tooltip";
import { cn } from "@/utils";

const buttonVariants = cva(
    "cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none",
    {
        variants: {
            variant: {
                plain: "",
                default: "hover:opacity-80 focus:opacity-80 border border-silver-dull",
            },
            size: {
                default: "h-9 px-4 py-2 has-[>svg]:px-3",
                sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
                lg: "h-14 rounded-md px-6 has-[>svg]:px-4 text-xl",
                icon: "size-8",
            },
        },
        defaultVariants: {
            variant: "plain",
            size: "default",
        },
    }
);

function Button({
    className,
    variant,
    size,
    tooltip,
    asChild = false,
    ...props
}: React.ComponentProps<"button"> &
    VariantProps<typeof buttonVariants> & {
        tooltip: string;
        asChild?: boolean;
    }) {
    const Comp = asChild ? Slot : "button";

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Comp
                    data-slot="button"
                    className={cn(buttonVariants({ variant, size, className }))}
                    {...props}
                />
            </TooltipTrigger>

            <TooltipContent>{tooltip}</TooltipContent>
        </Tooltip>
    );
}

export { Button, buttonVariants };
