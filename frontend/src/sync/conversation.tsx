import React, { createContext, useContext } from "react";

import {
    ConversationSchema,
    LargeLanguageModel,
    MemberSchema,
    MessageMetadataSchema,
    UserSchema,
} from "@/api";
import { useUser } from "@/components/auth";

import { db } from "./database";
import { useCachedLiveQuery } from "./utils";

export interface MessageTreeSchema {
    message: MessageMetadataSchema;
    replies: MessageTreeSchema[];
}

interface CustomizedConversationSchema extends ConversationSchema {
    llms: Array<LargeLanguageModel>;
    messageBranches: MemberSchema["messageBranches"];
}

const ConversationContext = createContext<CustomizedConversationSchema | null>(null);
const MessageTreeContext = createContext<Array<MessageTreeSchema> | null>(null);
const UserMapContext = createContext<Record<string, UserSchema> | null>(null);

export function ConversationProvider(props: { conversationId: string; children: React.ReactNode }) {
    /**************************************************************************/
    /* State */
    const user = useUser();

    const data = useCachedLiveQuery(async () => {
        const [baseConversation, member, flatMessages] = await Promise.all([
            db.conversations.get(props.conversationId),
            db.members
                .where(["conversationId", "userId"])
                .equals([props.conversationId, user.id])
                .first(),
            db.messagesMetadata
                .where("conversationId")
                .equals(props.conversationId)
                .sortBy("created"),
        ]);

        if (!baseConversation) {
            return { conversation: undefined, messageTrees: undefined };
        }

        if (!member) {
            return { conversation: undefined, messageTrees: undefined };
        }

        const conversation = {
            ...baseConversation,
            llms: member.llmsSelected,
            messageBranches: member.messageBranches,
        } satisfies CustomizedConversationSchema;

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
        const messageTrees = flatMessages
            .filter((msg) => msg.replyToId === null)
            .map((rootMessage) => buildTree(rootMessage));

        return { conversation, messageTrees };
    }, [props.conversationId, user.id]);

    const userMap = useCachedLiveQuery(async () => {
        const members = await db.members
            .where("conversationId")
            .equals(props.conversationId)
            .sortBy("created");

        const userIds = members.map((member) => member.userId);

        const users = await db.users.where("id").anyOf(userIds).toArray();

        return Object.fromEntries(users.map((user) => [user.id, user]));
    }, []);

    if (data === undefined) return null;
    if (data.conversation === undefined) return null;
    if (data.messageTrees === undefined) return null;
    if (userMap === undefined) return null;

    /**************************************************************************/
    /* Render */
    return (
        <ConversationContext.Provider value={data.conversation}>
            <MessageTreeContext.Provider value={data.messageTrees}>
                <UserMapContext.Provider value={userMap}>{props.children}</UserMapContext.Provider>
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
