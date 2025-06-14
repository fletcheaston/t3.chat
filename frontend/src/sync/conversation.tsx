import React, { createContext, useContext } from "react";

import { MessageMetadataSchema, UserSchema } from "@/api";

import { db } from "./database";
import { useCachedLiveQuery } from "./utils";

export type MessageTreeSchema = {
    message: MessageMetadataSchema;
    replies: MessageTreeSchema[];
};

const MessageTreeContext = createContext<Array<MessageTreeSchema> | null>(null);
const UserMapContext = createContext<Record<string, UserSchema> | null>(null);

export function ConversationProvider(props: { conversationId: string; children: React.ReactNode }) {
    /**************************************************************************/
    /* State */
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
        const users = await db.users.toArray();

        return Object.fromEntries(users.map((user) => [user.id, user]));
    }, []);

    if (messageTrees === undefined) return null;
    if (userMap === undefined) return null;

    /**************************************************************************/
    /* Render */
    return (
        <MessageTreeContext.Provider value={messageTrees}>
            <UserMapContext.Provider value={userMap}>{props.children}</UserMapContext.Provider>
        </MessageTreeContext.Provider>
    );
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
