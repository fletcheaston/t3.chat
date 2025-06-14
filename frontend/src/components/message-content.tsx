import { useEffect, useRef } from "react";

import { CopyIcon } from "lucide-react";
import { toast } from "sonner";

import { MessageSchema } from "@/api";
import { useUser } from "@/api/auth";
import { llmToName } from "@/api/models";
import { useUserMap } from "@/sync/conversation";
import { Button } from "@/ui/button";
import { formatDatetime } from "@/utils";

import { Markdown } from "./markdown";

function MyMessage(props: { message: MessageSchema }) {
    /**************************************************************************/
    /* State */
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!ref.current) return;

        ref.current.scrollIntoView({ inline: "end", behavior: "smooth" });
    }, [props.message.content]);

    /**************************************************************************/
    /* Render */
    return (
        <div className="flex justify-end">
            <div className="group relative flex w-[85%] justify-end pb-10">
                <div
                    ref={ref}
                    className="bg-gunmetal text-silver overflow-x-hidden rounded-xl rounded-br-none px-4 py-2 leading-7 text-wrap"
                >
                    <Markdown content={props.message.content} />
                </div>

                <div className="absolute right-0 bottom-0 opacity-0 transition-all group-hover:opacity-100">
                    <div className="flex items-center gap-2">
                        <p className="text-sm">{formatDatetime(props.message.modified)}</p>

                        <Button
                            size="custom"
                            className="hover:bg-pantone-light hover:text-gunmetal-dark size-6 rounded"
                            tooltip="Copy message"
                            onClick={async () => {
                                await navigator.clipboard.writeText(props.message.content);

                                toast.dismiss();
                                toast.success("Copied to clipboard!", { duration: 1500 });
                            }}
                        >
                            <CopyIcon
                                height={8}
                                width={8}
                            />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function OtherMessage(props: {
    message: MessageSchema;
    authorName: string;
    authorImageUrl: string;
}) {
    /**************************************************************************/
    /* State */
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!ref.current) return;

        ref.current.scrollIntoView({ inline: "end", behavior: "smooth" });
    }, [props.message.content]);

    /**************************************************************************/
    /* Render */
    return (
        <div className="group relative pb-10">
            <div
                ref={ref}
                className="flex flex-col gap-y-4 overflow-x-hidden px-1 leading-7 text-wrap"
            >
                <Markdown content={props.message.content} />
            </div>

            <div className="absolute bottom-0 left-0 opacity-0 transition-all group-hover:opacity-100">
                <div className="flex items-center gap-2">
                    <Button
                        size="custom"
                        className="hover:bg-pantone-light hover:text-gunmetal-dark size-6 rounded"
                        tooltip="Copy message"
                        onClick={async () => {
                            await navigator.clipboard.writeText(props.message.content);

                            toast.dismiss();
                            toast.success("Copied to clipboard!", { duration: 1500 });
                        }}
                    >
                        <CopyIcon
                            height={8}
                            width={8}
                        />
                    </Button>

                    <p className="text-sm">{formatDatetime(props.message.modified)}</p>

                    <p className="text-pantone-light text-sm">{props.authorName}</p>
                </div>
            </div>
        </div>
    );
}

export function MessageContent(props: { messages: Array<MessageSchema> }) {
    /**************************************************************************/
    /* State */
    const self = useUser();
    const userMap = useUserMap();

    /**************************************************************************/
    /* Render */
    return (
        <div className="flex flex-col gap-10 px-4">
            {props.messages.map((message) => {
                if (message.authorId === self.id) {
                    return (
                        <MyMessage
                            key={message.id}
                            message={message}
                        />
                    );
                }

                const user = userMap[message.authorId ?? ""];

                if (user) {
                    return (
                        <OtherMessage
                            key={message.id}
                            message={message}
                            authorName={user.name}
                            authorImageUrl={user.imageUrl}
                        />
                    );
                }

                // We know for sure that we've got an `llm` here
                const llm = message.llm!;

                return (
                    <OtherMessage
                        key={message.id}
                        message={message}
                        authorName={llmToName[llm]}
                        authorImageUrl={llmToName[llm]}
                    />
                );
            })}
        </div>
    );
}
