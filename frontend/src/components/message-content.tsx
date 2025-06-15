import { useCallback, useMemo, useRef, useState } from "react";
import * as React from "react";

import { BanIcon, CheckIcon, CopyIcon, EditIcon, SplitIcon } from "lucide-react";
import { toast } from "sonner";

import { MessageSchema, NewMessageSchema, createMessage, updateConversation } from "@/api";
import { MessageTreeSchema, useConversation, useUserMap } from "@/sync/conversation";
import { db } from "@/sync/database";
import { MessageProvider, useMessage } from "@/sync/message";
import { Button } from "@/ui/button";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/ui/carousel";
import { Textarea } from "@/ui/textarea";
import { cn, formatDatetime } from "@/utils";

import { useUser } from "./auth";
import { Markdown } from "./markdown";
import { llmToImageUrl, llmToName } from "./models";

function CopyButton(props: { value: string }) {
    /**************************************************************************/
    /* Render */
    return (
        <Button
            size="custom"
            className="hover:bg-primary-light hover:text-background-dark size-7 rounded"
            tooltip="Copy message"
            onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();

                navigator.clipboard.writeText(props.value).then(() => {
                    toast.dismiss();
                    toast.success("Copied to clipboard!", { duration: 1500 });
                });
            }}
        >
            <CopyIcon
                height={10}
                width={10}
            />
        </Button>
    );
}

function ActionButton(props: {
    onClick: (() => void) | null;
    tooltip: string;
    children: React.ReactNode;
}) {
    /**************************************************************************/
    /* Render */
    return (
        <Button
            size="custom"
            className="hover:bg-primary-light hover:text-background-dark size-7 rounded"
            tooltip={props.tooltip}
            disabled={props.onClick === null}
            onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();

                if (props.onClick) {
                    props.onClick();
                }
            }}
        >
            {props.children}
        </Button>
    );
}

function ViewMyMessage(props: {
    message: MessageSchema;
    unsetBranch: (() => void) | null;
    onEditStart: () => void;
}) {
    /**************************************************************************/
    /* State */
    const ref = useRef<HTMLDivElement>(null);

    // useEffect(() => {
    //     if (!ref.current) return;
    //
    //     ref.current.scrollIntoView({ inline: "end", behavior: "smooth" });
    // }, [props.message.content]);

    /**************************************************************************/
    /* Render */
    return (
        <div
            data-message-id={props.message.id}
            className="flex justify-end"
        >
            <div
                data-limit-width
                className="group relative flex w-[85%] justify-end pb-6"
            >
                <div className="bg-background text-text overflow-x-hidden rounded-xl rounded-br-none px-4 py-2 leading-7 text-wrap">
                    <Markdown content={props.message.content} />
                </div>

                <div
                    ref={ref}
                    className="absolute right-0 -bottom-2 opacity-0 transition-all group-hover:opacity-100"
                >
                    <div className="flex items-center gap-1 text-xs">
                        <p>{formatDatetime(props.message.modified)}</p>

                        <ActionButton
                            onClick={props.unsetBranch}
                            tooltip="View branches"
                        >
                            <SplitIcon
                                height={10}
                                width={10}
                                className="rotate-180"
                            />
                        </ActionButton>

                        <ActionButton
                            onClick={props.onEditStart}
                            tooltip="Edit"
                        >
                            <EditIcon
                                width={10}
                                height={10}
                            />
                        </ActionButton>

                        <CopyButton value={props.message.content} />
                    </div>
                </div>
            </div>
        </div>
    );
}

function BranchMyMessage(props: { message: MessageSchema; onEditStop: () => void }) {
    /**************************************************************************/
    /* State */
    const conversation = useConversation();

    // Initial content comes from original message
    const contentRef = useRef(props.message.content);

    const branchMessage = useCallback(async () => {
        const content = contentRef.current;

        if (!content) {
            toast.warning("Please enter something before saving your message");
            return;
        }

        const timestamp = new Date().toISOString();

        const branchedMessage: NewMessageSchema = {
            id: crypto.randomUUID(),
            title: "",
            content,
            conversationId: conversation.id,
            replyToId: props.message.replyToId,
            llms: [],
        } as const;

        const messageBranches = {
            ...conversation.messageBranches,
            [props.message.id]: false,
            [branchedMessage.id]: true,
        };

        // Optimistic local updates
        db.transaction(
            "readwrite",
            db.conversations,
            db.messages,
            db.messagesMetadata,
            async () => {
                await db.conversations.put(
                    {
                        ...conversation,
                        messageBranches,
                    },
                    conversation.id
                );

                await db.messages.put(
                    {
                        created: timestamp,
                        modified: timestamp,
                        authorId: props.message.authorId,
                        llm: null,
                        ...branchedMessage,
                    },
                    branchedMessage.id
                );

                await db.messagesMetadata.put(
                    {
                        id: branchedMessage.id,
                        created: timestamp,
                        conversationId: branchedMessage.conversationId,
                        replyToId: branchedMessage.replyToId,
                    },
                    branchedMessage.id
                );
            }
        );

        // Sync with API
        const { data: confirmedConversation } = await updateConversation({
            path: {
                conversation_id: conversation.id,
            },
            body: {
                messageBranches,
            },
        });

        if (!confirmedConversation) {
            throw new Error("Unable to edit message");
        }

        const { data: confirmedMessage } = await createMessage({
            body: branchedMessage,
        });

        if (!confirmedMessage) {
            throw new Error("Unable to edit message");
        }

        // Add confirmed data to local database
        db.transaction(
            "readwrite",
            db.conversations,
            db.messages,
            db.messagesMetadata,
            async () => {
                await db.conversations.put(confirmedConversation, conversation.id);
                await db.messages.put(confirmedMessage, confirmedMessage.id);
                await db.messagesMetadata.put(
                    {
                        id: confirmedMessage.id,
                        created: confirmedMessage.created,
                        conversationId: confirmedMessage.conversationId,
                        replyToId: confirmedMessage.replyToId,
                    },
                    confirmedMessage.id
                );
            }
        );
    }, [props.message, conversation]);

    /**************************************************************************/
    /* Render */
    return (
        <div
            data-message-id={props.message.id}
            className="flex justify-end"
        >
            <div
                data-limit-width
                className="group relative flex w-[85%] justify-end pb-6"
            >
                <div className="bg-background text-text w-full overflow-x-hidden rounded-xl rounded-br-none px-4 py-2 leading-7">
                    <Textarea
                        defaultValue={props.message.content}
                        onChange={(event) => (contentRef.current = event.target.value)}
                        placeholder="Type your message here..."
                        className="max-h-48"
                    />
                </div>

                <div className="absolute right-0 -bottom-2 opacity-0 transition-all group-hover:opacity-100">
                    <div className="flex items-center gap-2">
                        <ActionButton
                            onClick={branchMessage}
                            tooltip="Save"
                        >
                            <CheckIcon
                                height={10}
                                width={10}
                            />
                        </ActionButton>

                        <ActionButton
                            onClick={props.onEditStop}
                            tooltip="Cancel"
                        >
                            <BanIcon
                                height={10}
                                width={10}
                            />
                        </ActionButton>

                        <CopyButton value={props.message.content} />
                    </div>
                </div>
            </div>
        </div>
    );
}

function MyMessage(props: { message: MessageSchema; unsetBranch: (() => void) | null }) {
    /**************************************************************************/
    /* State */
    const [editing, setEditing] = useState(false);

    /**************************************************************************/
    /* Render */
    if (!editing) {
        return (
            <ViewMyMessage
                message={props.message}
                unsetBranch={props.unsetBranch}
                onEditStart={() => setEditing(true)}
            />
        );
    }

    return (
        <BranchMyMessage
            message={props.message}
            onEditStop={() => setEditing(false)}
        />
    );
}

function OtherMessage(props: {
    message: MessageSchema;
    unsetBranch: (() => void) | null;
    authorName: string;
    authorImageUrl: string;
}) {
    /**************************************************************************/
    /* State */
    const ref = useRef<HTMLDivElement>(null);

    // useEffect(() => {
    //     if (!ref.current) return;
    //
    //     ref.current.scrollIntoView({ inline: "end", behavior: "smooth" });
    // }, [props.message.content]);

    /**************************************************************************/
    /* Render */
    return (
        <div
            data-message-id={props.message.id}
            className="group relative pb-6"
        >
            <div className="flex flex-col gap-y-4 overflow-x-hidden px-1 leading-7 text-wrap">
                <Markdown content={props.message.content} />
            </div>

            <div
                ref={ref}
                className="absolute -bottom-2 left-0 opacity-0 transition-all group-hover:opacity-100"
            >
                <div className="flex items-center gap-1 text-xs font-medium">
                    <CopyButton value={props.message.content} />

                    <ActionButton
                        onClick={props.unsetBranch}
                        tooltip="View branches"
                    >
                        <SplitIcon
                            height={10}
                            width={10}
                            className="rotate-180"
                        />
                    </ActionButton>

                    <p>{formatDatetime(props.message.modified)}</p>

                    <div className="border-background-light h-3 border-l" />

                    <p className="text-primary">{props.authorName}</p>

                    {props.authorImageUrl ? (
                        <img
                            src={props.authorImageUrl}
                            alt={props.authorName}
                            className="size-4 rounded"
                        />
                    ) : null}
                </div>
            </div>
        </div>
    );
}

export function MessageContent(props: { unsetBranch: (() => void) | null }) {
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
                unsetBranch={props.unsetBranch}
            />
        );
    }

    const user = userMap[message.authorId ?? ""];

    if (user) {
        return (
            <OtherMessage
                key={message.id}
                message={message}
                unsetBranch={props.unsetBranch}
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
            unsetBranch={props.unsetBranch}
            authorName={llmToName[llm]}
            authorImageUrl={llmToImageUrl[llm]}
        />
    );
}

export function MessageTree(props: { messageTree: Array<MessageTreeSchema> }) {
    /**************************************************************************/
    /* State */
    const [orientation] = useState<"horizontal" | "vertical">("vertical");

    const conversation = useConversation();

    const selectedBranch = useMemo(() => {
        return props.messageTree.find((tree) => {
            return conversation.messageBranches[tree.message.id];
        });
    }, [props.messageTree, conversation.messageBranches]);

    const setMessageBranch = useCallback(
        async (messageId: string | null) => {
            // Optimistic add data to local database
            const messageBranches = {
                ...conversation.messageBranches,
            };

            props.messageTree.forEach((tree) => {
                messageBranches[tree.message.id] = false;
            });

            if (messageId !== null) {
                messageBranches[messageId] = true;
            }

            await db.conversations.put(
                {
                    ...conversation,
                    messageBranches,
                },
                conversation.id
            );

            // Sync with API
            const { data: confirmedConversation } = await updateConversation({
                path: {
                    conversation_id: conversation.id,
                },
                body: {
                    messageBranches,
                },
            });

            if (!confirmedConversation) {
                throw new Error("Unable to create conversation");
            }

            // Add confirmed data to local database
            await db.conversations.put(confirmedConversation, conversation.id);
        },
        [props.messageTree, conversation.id]
    );

    /**************************************************************************/
    /* Render */
    if (props.messageTree.length === 1) {
        const { message, replies } = props.messageTree[0]!;

        return (
            <div className="flex flex-col gap-10">
                <MessageProvider messageId={message.id}>
                    <MessageContent unsetBranch={null} />
                </MessageProvider>

                {replies.length > 0 ? <MessageTree messageTree={replies} /> : null}
            </div>
        );
    }

    if (selectedBranch) {
        return (
            <div className="flex flex-col gap-10">
                <MessageProvider messageId={selectedBranch.message.id}>
                    <MessageContent unsetBranch={() => setMessageBranch(null)} />
                </MessageProvider>

                {selectedBranch.replies.length > 0 ? (
                    <MessageTree messageTree={selectedBranch.replies} />
                ) : null}
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-10">
            <Carousel
                orientation={orientation}
                className="w-full"
                opts={{ startIndex: 0, watchDrag: false }}
            >
                <CarouselContent
                    className={orientation === "horizontal" ? "px-1 pl-4" : "py-1 pt-4"}
                >
                    {props.messageTree.map((tree) => (
                        <CarouselItem
                            key={tree.message.id}
                            className={cn(
                                "group bg-background hover:bg-background-light border-background-light h-fit basis-3/5 cursor-pointer rounded-lg border pr-1 pb-4 pl-1",
                                "[&_[data-limit-width]]:w-full",
                                orientation === "horizontal" ? "mx-1" : "my-1"
                            )}
                            onClick={() => {
                                setMessageBranch(tree.message.id);
                            }}
                        >
                            <MessageProvider messageId={tree.message.id}>
                                <MessageContent unsetBranch={null} />
                            </MessageProvider>
                        </CarouselItem>
                    ))}
                </CarouselContent>

                <CarouselPrevious tooltip="Previous" />
                <CarouselNext tooltip="Next" />
            </Carousel>
        </div>
    );
}
