import { createFileRoute } from "@tanstack/react-router";

import { MessageContent } from "@/components/message-content";
import { MessageWindow } from "@/components/message-window";

export const Route = createFileRoute("/chat/")({
    component: RouteComponent,
});

function RouteComponent() {
    /**************************************************************************/
    /* Render */
    return (
        <div className="flex h-full justify-center overflow-y-auto px-2">
            <div className="flex max-w-3xl grow flex-col">
                <div className="grow">
                    <MessageContent />
                </div>

                <div className="sticky bottom-0 rounded-xl">
                    <MessageWindow />
                </div>
            </div>
        </div>
    );
}
