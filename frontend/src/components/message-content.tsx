import { useMessages } from "@/sync/messages";

export function MessageContent() {
    /**************************************************************************/
    /* State */
    const messages = useMessages();

    /**************************************************************************/
    /* Render */
    return (
        <div className="flex flex-col gap-4 px-4">
            {messages.map((message) => {
                return <p key={message.id}>{message.content}</p>;
            })}
        </div>
    );
}
