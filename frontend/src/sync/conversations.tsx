import React, { createContext, useContext } from "react";

import { ConversationSchema } from "@/api";

import { db } from "./database";
import { useCachedLiveQuery } from "./utils";

const ConversationsContext = createContext<Array<ConversationSchema> | null>(null);

export function ConversationsProvider(props: { children: React.ReactNode }) {
    /**************************************************************************/
    /* State */
    const data = useCachedLiveQuery(async () => {
        return db.conversations.orderBy("created").reverse().toArray();
    }, []);

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
