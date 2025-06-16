import React, { createContext, useContext } from "react";

import { ConversationSchema, LargeLanguageModel, MessageSchema, MessageMetadataSchema, UserSchema } from "@/api";
import { useUser } from "@/components/auth";

import { db } from "./database";
import { useCachedLiveQuery } from "./utils";

export interface MessageTreeSchema {
    message: MessageMetadataSchema;
    replies: MessageTreeSchema[];
}

interface CustomizedConversationSchema extends ConversationSchema {
    llms: Array<LargeLanguageModel>;
}

const ConversationContext = createContext<CustomizedConversationSchema | null>(null);
const MessageTreeContext = createContext<Array<MessageTreeSchema> | null>(null);
const UserMapContext = createContext<Record<string, UserSchema> | null>(null);
const MessagesContext = createContext<Array<MessageSchema> | null>(null);

export function ConversationProvider(props: { conversationId: string; children: React.ReactNode }) {
    /**************************************************************************/
    /* State */
    const user = useUser();

    const conversation = useCachedLiveQuery(async () => {
        const conversation = await db.conversations.get(props.conversationId);

        if (!conversation) return;

        const member = await db.members
            .where(["conversationId", "userId"])
            .equals([props.conversationId, user.id])
            .first();

        if (!member) return;

        return {
            ...conversation,
            llms: member.llmsSelected,
        } satisfies CustomizedConversationSchema;
    }, [props.conversationId, user.id]);

    const messageTrees = useCachedLiveQuery(async () => {
        const flatMessages = await db.messagesMetadata
            .where("conversationId")
            .equals(props.conversationId)
            .sortBy("created");

        // Build the tree structure
        function buildTree(message: MessageMetadataSchema): MessageTreeSchema {
            const replies = flatMessages
                .filter((msg) => msg.replyToId === message.id)
                .map((msg) => buildTree(msg));

            return {
                message,
                replies,
            };
        }

        // Build the tree from our root messages
        return flatMessages
            .filter((msg) => msg.replyToId === null)
            .map((rootMessage) => buildTree(rootMessage));
    }, [props.conversationId]);

    const userMap = useCachedLiveQuery(async () => {
        const members = await db.members
            .where("conversationId")
            .equals(props.conversationId)
            .sortBy("created");

        const userIds = members.map((member) => member.userId);

        const users = await db.users.where("id").anyOf(userIds).toArray();

        return Object.fromEntries(users.map((user) => [user.id, user]));
    }, []);

    const messages = useCachedLiveQuery(async () => {
        return db.messages
            .where("conversationId")
            .equals(props.conversationId)
            .sortBy("created");
    }, [props.conversationId]);

    if (conversation === undefined) return null;
    if (messageTrees === undefined) return null;
    if (userMap === undefined) return null;
    if (messages === undefined) return null;

    /**************************************************************************/
    /* Render */
    return (
        <ConversationContext.Provider value={conversation}>
            <MessageTreeContext.Provider value={messageTrees}>
                <UserMapContext.Provider value={userMap}>
                    <MessagesContext.Provider value={messages}>
                        {props.children}
                    </MessagesContext.Provider>
                </UserMapContext.Provider>
            </MessageTreeContext.Provider>
        </ConversationContext.Provider>
    );
}

export function useConversation() {
    const result = useContext(ConversationContext);

    if (result === null) {
        throw new Error("Missing context provider.");
    }

    return result;
}

export function useMessageTree() {
    const result = useContext(MessageTreeContext);

    if (result === null) {
        throw new Error("Missing context provider.");
    }

    return result;
}

export function useUserMap() {
    const result = useContext(UserMapContext);

    if (result === null) {
        throw new Error("Missing context provider.");
    }

    return result;
}

export function useMessages() {
    const result = useContext(MessagesContext);

    if (result === null) {
        throw new Error("Missing context provider.");
    }

    return result;
}
