import { useEffect, useRef } from "react";

import { CopyIcon } from "lucide-react";
import { toast } from "sonner";

import { MessageMetadataSchema, MessageSchema } from "@/api";
import { useUser } from "@/api/auth";
import { llmToImageUrl, llmToName } from "@/api/models";
import { useUserMap } from "@/sync/conversation";
import { MessageProvider, useMessage } from "@/sync/message";
import { Button } from "@/ui/button";
import { formatDatetime } from "@/utils";

import { Markdown } from "./markdown";

function CopyButton(props: { value: string }) {
    return (
        <Button
            size="custom"
            className="hover:bg-pantone-light hover:text-gunmetal-dark size-7 rounded"
            tooltip="Copy message"
            onClick={async () => {
                await navigator.clipboard.writeText(props.value);

                toast.dismiss();
                toast.success("Copied to clipboard!", { duration: 1500 });
            }}
        >
            <CopyIcon
                height={10}
                width={10}
            />
        </Button>
    );
}

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
            <div className="group relative flex w-[85%] justify-end pb-6">
                <div className="bg-gunmetal text-silver overflow-x-hidden rounded-xl rounded-br-none px-4 py-2 leading-7 text-wrap">
                    <Markdown content={props.message.content} />
                </div>

                <div
                    ref={ref}
                    className="absolute right-0 -bottom-2 opacity-0 transition-all group-hover:opacity-100"
                >
                    <div className="flex items-center gap-2">
                        <p className="text-base">{formatDatetime(props.message.modified)}</p>

                        <CopyButton value={props.message.content} />
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
        <div className="group relative pb-6">
            <div className="flex flex-col gap-y-4 overflow-x-hidden px-1 leading-7 text-wrap">
                <Markdown content={props.message.content} />
            </div>

            <div
                ref={ref}
                className="absolute -bottom-2 left-0 opacity-0 transition-all group-hover:opacity-100"
            >
                <div className="flex items-center gap-2">
                    <CopyButton value={props.message.content} />

                    <p className="text-base">{formatDatetime(props.message.modified)}</p>

                    <div className="border-silver h-4 border-l" />

                    <div className="flex items-center gap-1">
                        <p className="text-pantone-light text-base">{props.authorName}</p>

                        {props.authorImageUrl ? (
                            <img
                                src={props.authorImageUrl}
                                alt={props.authorName}
                                className="size-6 rounded"
                            />
                        ) : null}
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
    const userMap = useUserMap();
    const message = useMessage();

    /**************************************************************************/
    /* Render */
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
            authorImageUrl={llmToImageUrl[llm] ?? ""}
        />
    );
}

export function MessageTree(props: { messageTree: Array<MessageMetadataSchema> }) {
    /**************************************************************************/
    /* Render */
    return (
        <div className="flex flex-col gap-10 px-4">
            {props.messageTree.map((metadata) => {
                return (
                    <MessageProvider
                        key={metadata.id}
                        messageId={metadata.id}
                    >
                        <MessageContent />
                    </MessageProvider>
                );
            })}
        </div>
    );
}
