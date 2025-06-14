import React, { createContext, useContext } from "react";

import { MessageMetadataSchema, UserSchema } from "@/api";

import { db } from "./database";
import { useCachedLiveQuery } from "./utils";

const MessageTreeContext = createContext<Array<MessageMetadataSchema> | null>(null);
const UserMapContext = createContext<Record<string, UserSchema> | null>(null);

export function ConversationProvider(props: { conversationId: string; children: React.ReactNode }) {
    /**************************************************************************/
    /* State */
    const messages = useCachedLiveQuery(async () => {
        return db.messagesMetadata
            .where("conversationId")
            .equals(props.conversationId)
            .sortBy("created");
    }, [props.conversationId]);

    const userMap = useCachedLiveQuery(async () => {
        const users = await db.users.toArray();

        return Object.fromEntries(users.map((user) => [user.id, user]));
    }, []);

    if (messages === undefined) return null;
    if (userMap === undefined) return null;

    /**************************************************************************/
    /* Render */
    return (
        <MessageTreeContext.Provider value={messages}>
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
