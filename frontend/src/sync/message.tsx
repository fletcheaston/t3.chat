import React, { createContext, useContext } from "react";

import { MessageSchema } from "@/api";

import { db } from "./database";
import { useCachedLiveQuery } from "./utils";

const MessageContext = createContext<MessageSchema | null>(null);

export function MessageProvider(props: { messageId: string; children: React.ReactNode }) {
    /**************************************************************************/
    /* State */
    const message = useCachedLiveQuery(async () => {
        return db.messages.get(props.messageId);
    }, [props.messageId]);

    if (message === undefined) {
        return <div className="min-h-[70px]" />;
    }

    /**************************************************************************/
    /* Render */
    return <MessageContext.Provider value={message}>{props.children}</MessageContext.Provider>;
}

export function useMessage() {
    const result = useContext(MessageContext);

    if (result === null) {
        throw new Error("Missing context provider.");
    }

    return result;
}
