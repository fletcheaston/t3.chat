import { createFileRoute } from "@tanstack/react-router";

import { MessageContent } from "@/components/message-content";
import { MessagesProvider } from "@/sync/messages";

export const Route = createFileRoute("/chat/$chatId")({
    component: RouteComponent,
});

function RouteComponent() {
    /**************************************************************************/
    /* State */
    const { chatId } = Route.useParams();

    /**************************************************************************/
    /* Render */
    return (
        <MessagesProvider conversationId={chatId}>
            <MessageContent />
        </MessagesProvider>
    );
}
