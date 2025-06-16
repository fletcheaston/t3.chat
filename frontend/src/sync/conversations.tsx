import React, { createContext, useContext } from "react";

import { ConversationSchema } from "@/api";
import { useUser } from "@/components/auth";

import { db } from "./database";
import { useCachedLiveQuery } from "./utils";

interface CustomizedConversationSchema extends ConversationSchema {
    hidden: boolean;
}

const ConversationsContext = createContext<Array<CustomizedConversationSchema> | null>(null);

export function ConversationsProvider(props: { children: React.ReactNode }) {
    /**************************************************************************/
    /* State */
    const user = useUser();

    const data = useCachedLiveQuery(async () => {
        const conversations = await db.conversations.orderBy("created").reverse().toArray();

        const members = await db.members.where("userId").equals(user.id).toArray();

        const memberMap = Object.fromEntries(
            members.map((member) => [member.conversationId, member])
        );

        return conversations.map((conversation) => {
            return {
                ...conversation,
                hidden: memberMap[conversation.id]?.hidden || false,
            };
        });
    }, [user.id]);

    if (data === undefined) return null;

    /**************************************************************************/
    /* Render */
    return (
        <ConversationsContext.Provider value={data}>{props.children}</ConversationsContext.Provider>
    );
}

export function useConversations() {
    const result = useContext(ConversationsContext);

    if (result === null) {
        throw new Error("Missing context provider.");
    }

    return result;
}
