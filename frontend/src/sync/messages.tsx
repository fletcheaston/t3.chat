import React, { createContext, useContext } from "react";

import { MessageSchema } from "@/api";

import { db } from "./database";
import { useCachedLiveQuery } from "./utils";

const MessagesContext = createContext<Array<MessageSchema> | null>(null);

export function MessagesProvider(props: { conversationId: string; children: React.ReactNode }) {
    /**************************************************************************/
    /* State */
    const data = useCachedLiveQuery(async () => {
        return db.messages.where("conversationId").equals(props.conversationId).sortBy("created");
    }, [props.conversationId]);

    if (data === undefined) return null;

    /**************************************************************************/
    /* Render */
    return <MessagesContext.Provider value={data}>{props.children}</MessagesContext.Provider>;
}

export function useMessages() {
    const result = useContext(MessagesContext);

    if (result === null) {
        throw new Error("Missing context provider.");
    }

    return result;
}
