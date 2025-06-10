import React, { createContext, useContext, useMemo } from "react";

import { ConversationSchema } from "@/api";

import { db } from "./database";
import { Loading, useCachedLiveQuery } from "./utils";

function useDexieConversations(): Loading<Array<ConversationSchema>> {
    const conversations = useCachedLiveQuery(async () => {
        return db.conversations.orderBy("created").toArray();
    }, []);

    return useMemo(() => {
        if (!conversations) {
            return { isLoading: true, data: null };
        }

        return {
            isLoading: false,
            data: conversations,
        };
    }, [conversations]);
}

const ConversationsContext = createContext<Array<ConversationSchema> | null>(null);

export function ConversationsProvider(props: { children: React.ReactNode }) {
    const conversations = useDexieConversations();

    if (conversations === null) return null;

    return (
        <ConversationsContext.Provider value={conversations.data}>
            {props.children}
        </ConversationsContext.Provider>
    );
}

export function useConversations() {
    const data = useContext(ConversationsContext);

    if (data === null) {
        throw new Error("Missing context provider.");
    }

    return data;
}
