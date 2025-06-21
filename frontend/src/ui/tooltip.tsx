import { ComponentProps } from "react";

import * as TooltipPrimitive from "@radix-ui/react-tooltip";

import { cn } from "@/utils";

function TooltipProvider({
    delayDuration = 0,
    ...props
}: ComponentProps<typeof TooltipPrimitive.Provider>) {
    return (
        <TooltipPrimitive.Provider
            data-slot="tooltip-provider"
            delayDuration={delayDuration}
            {...props}
        />
    );
}

function Tooltip({ ...props }: ComponentProps<typeof TooltipPrimitive.Root>) {
    return (
        <TooltipProvider>
            <TooltipPrimitive.Root
                data-slot="tooltip"
                {...props}
            />
        </TooltipProvider>
    );
}

function TooltipTrigger({ ...props }: ComponentProps<typeof TooltipPrimitive.Trigger>) {
    return (
        <TooltipPrimitive.Trigger
            data-slot="tooltip-trigger"
            {...props}
        />
    );
}

function TooltipContent({
    className,
    sideOffset = -1,
    children,
    ...props
}: ComponentProps<typeof TooltipPrimitive.Content>) {
    return (
        <TooltipPrimitive.Portal>
            <TooltipPrimitive.Content
                data-slot="tooltip-content"
                side="bottom"
                sideOffset={sideOffset}
                className={cn(
                    "bg-secondary-light text-background-dark animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit origin-(--radix-tooltip-content-transform-origin) rounded-md px-2 py-1 text-xs text-balance",
                    className
                )}
                {...props}
            >
                {children}
                <TooltipPrimitive.Arrow className="bg-transparent fill-transparent" />
            </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
    );
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
