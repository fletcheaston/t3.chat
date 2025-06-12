import { MessageSchema, UserSchema } from "@/api";
import { useUser } from "@/api/auth";
import { useMessages, useUserMap } from "@/sync/conversation";

function MyMessage(props: { message: MessageSchema }) {
    /**************************************************************************/
    /* Render */
    return (
        <div className="flex justify-end">
            <div className="bg-gunmetal text-silver max-w-[85%] rounded-xl rounded-br-none p-3">
                <p className="whitespace-pre-wrap">{props.message.content}</p>
            </div>
        </div>
    );
}

function AnonMessage(props: { message: MessageSchema }) {
    /**************************************************************************/
    /* Render */
    return (
        <div className="w-full text-left">
            <p className="whitespace-pre-wrap">{props.message.content}</p>
        </div>
    );
}

function OtherMessage(props: { message: MessageSchema; user: UserSchema }) {
    /**************************************************************************/
    /* Render */
    return (
        <div className="w-full text-left">
            <p className="whitespace-pre-wrap">{props.message.content}</p>
        </div>
    );
}

export function MessageContent() {
    /**************************************************************************/
    /* State */
    const self = useUser();
    const messages = useMessages();
    const userMap = useUserMap();

    /**************************************************************************/
    /* Render */
    return (
        <div className="flex flex-col gap-12 px-4">
            {messages.map((message) => {
                if (message.authorId === self.id) {
                    return (
                        <MyMessage
                            key={message.id}
                            message={message}
                        />
                    );
                }

                const user = userMap[message.authorId];

                if (!user) {
                    return (
                        <AnonMessage
                            key={message.id}
                            message={message}
                        />
                    );
                }

                return (
                    <OtherMessage
                        key={message.id}
                        message={message}
                        user={user}
                    />
                );
            })}
        </div>
    );
}
