import { CopyIcon } from "lucide-react";

import { MessageSchema, UserSchema } from "@/api";
import { useUser } from "@/api/auth";
import { useMessages, useUserMap } from "@/sync/conversation";
import { Button } from "@/ui/button";
import { formatDatetime } from "@/utils";

import { Markdown } from "./markdown";

function MyMessage(props: { message: MessageSchema }) {
    /**************************************************************************/
    /* Render */
    return (
        <div className="flex justify-end">
            <div className="group relative flex w-[85%] justify-end pb-10">
                <div className="bg-gunmetal text-silver overflow-x-hidden rounded-xl rounded-br-none p-4 leading-7 text-wrap">
                    <Markdown content={props.message.content} />
                </div>

                <div className="absolute right-0 bottom-0 opacity-0 transition-all group-hover:opacity-100">
                    <div className="flex items-center gap-4">
                        <p className="text-sm">{formatDatetime(props.message.created)}</p>

                        <Button
                            size="icon"
                            className="hover:bg-pantone-light hover:text-gunmetal-dark rounded"
                            tooltip="Copy message"
                        >
                            <CopyIcon />
                        </Button>
                    </div>
                </div>
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
        <div>
            <div className="group relative pb-10">
                <div className="overflow-x-hidden p-4 leading-7 text-wrap">
                    <Markdown content={props.message.content} />
                </div>

                <div className="absolute bottom-0 left-0 opacity-0 transition-all group-hover:opacity-100">
                    <div className="flex items-center gap-4">
                        <Button
                            size="icon"
                            className="hover:bg-pantone-light hover:text-gunmetal-dark rounded"
                            tooltip="Copy message"
                        >
                            <CopyIcon />
                        </Button>

                        <p className="text-sm">{formatDatetime(props.message.created)}</p>

                        <p className="text-pantone-light text-sm">{props.user.name}</p>
                    </div>
                </div>
            </div>
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
        <div className="flex flex-col gap-10 px-4">
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
