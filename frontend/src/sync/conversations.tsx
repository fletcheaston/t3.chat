import { ReactNode, createContext, useContext } from "react";

import { ConversationSchema, MemberSchema } from "@/api";
import { useUser } from "@/components/auth";

import { db } from "./database";
import { useCachedLiveQuery } from "./utils";

export interface Conversation extends ConversationSchema {
    hidden: boolean;
    llmsSelected: MemberSchema["llmsSelected"];
}

const ConversationsContext = createContext<Array<Conversation> | null>(null);

export function ConversationsProvider(props: { children: ReactNode }) {
    /**************************************************************************/
    /* State */
    const user = useUser();

    const data = useCachedLiveQuery(async () => {
        const [conversations, members] = await Promise.all([
            db.conversations.orderBy("created").reverse().toArray(),
            db.members.where("userId").equals(user.id).toArray(),
        ]);

        const memberMap = Object.fromEntries(
            members.map((member) => [member.conversationId, member])
        );

        return conversations.map((conversation) => {
            return {
                ...conversation,
                hidden: memberMap[conversation.id]?.hidden || false,
                llmsSelected: memberMap[conversation.id]?.llmsSelected || [],
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
