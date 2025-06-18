import {
    ConversationSchema,
    LargeLanguageModel,
    MemberSchema,
    MessageSchema,
    createConversation as apiCreateConversation,
    createMessage as apiCreateMessage,
    updateConversation as apiUpdateConversation,
} from "@/api";

import { db } from "./database";

export async function createConversation(
    userId: string,
    content: string,
    llms: Array<LargeLanguageModel>,
    onOptimisticSave: ((id: string) => Promise<void>) | null
) {
    // 1. Optimistically update local database
    const timestamp = new Date().toISOString();

    const conversation: ConversationSchema = {
        id: crypto.randomUUID(),
        created: timestamp,
        modified: timestamp,
        title: content,
        ownerId: userId,
    };

    const member: MemberSchema = {
        id: crypto.randomUUID(),
        created: timestamp,
        modified: timestamp,
        conversationId: conversation.id,
        userId: userId,
        addedById: userId,
        llmsSelected: llms,
        messageBranches: {},
        hidden: false,
    };

    const message: MessageSchema = {
        id: crypto.randomUUID(),
        created: timestamp,
        modified: timestamp,
        title: content,
        content: content,
        conversationId: conversation.id,
        replyToId: null,
        authorId: userId,
        llm: null,
    };

    await db.transaction(
        "readwrite",
        db.conversations,
        db.members,
        db.messages,
        db.messagesMetadata,
        async () => {
            await db.conversations.put(conversation, conversation.id);
            await db.members.put(member, member.id);
            await db.messages.put(message, message.id);
            await db.messagesMetadata.put(
                {
                    id: message.id,
                    conversationId: message.conversationId,
                    replyToId: message.replyToId,
                    created: timestamp,
                },
                message.id
            );
        }
    );

    // 1.5. If provided, optimistically navigate
    if (onOptimisticSave !== null) {
        await onOptimisticSave(conversation.id);
    }

    // 2. Save to API
    await apiCreateConversation({
        body: {
            id: conversation.id,
            title: conversation.title,
            memberId: member.id,
            messageId: message.id,
            messageTitle: message.title,
            messageContent: message.content,
            llms,
        },
    });
}

export async function createMessage(props: {
    userId: string;
    replyToId: string | null;
    siblingMessageId: string | null;
    conversationId: string;
    content: string;
    llms: Array<LargeLanguageModel>;
}) {
    // 1. Optimistically update local database
    const timestamp = new Date().toISOString();

    const message: MessageSchema = {
        id: crypto.randomUUID(),
        created: timestamp,
        modified: timestamp,
        title: props.content,
        content: props.content,
        conversationId: props.conversationId,
        replyToId: props.replyToId,
        authorId: props.userId,
        llm: null,
    };

    await db.transaction("readwrite", db.messages, db.messagesMetadata, db.members, async () => {
        await db.messages.put(message, message.id);
        await db.messagesMetadata.put(
            {
                id: message.id,
                conversationId: message.conversationId,
                replyToId: message.replyToId,
                created: timestamp,
            },
            message.id
        );

        const member = await db.members
            .where(["conversationId", "userId"])
            .equals([props.conversationId, props.userId])
            .first();

        if (!member) {
            throw new Error("Unable to find membership.");
        }

        const messageBranches = {
            ...member.messageBranches,
            [message.id]: true,
        };

        if (props.siblingMessageId) {
            messageBranches[props.siblingMessageId] = false;
        }

        await db.members.put(
            {
                ...member,
                messageBranches,
            },
            member.id
        );
    });

    // 2. Save to API
    await apiCreateMessage({
        body: {
            id: message.id,
            title: message.title,
            content: message.content,
            conversationId: message.conversationId,
            replyToId: message.replyToId,
            llms: props.llms,
        },
    });
}

export async function updateMessageBranches(
    userId: string,
    conversationId: string,
    hiddenMessageIds: Array<string>,
    shownMessageId: string
) {
    // 1. Optimistically update local database
    let messageBranches: Record<string, boolean> = {};

    await db.transaction("readwrite", db.members, async () => {
        const member = await db.members
            .where(["conversationId", "userId"])
            .equals([conversationId, userId])
            .first();

        if (!member) {
            throw new Error("Unable to find membership.");
        }

        messageBranches = { ...member.messageBranches };

        hiddenMessageIds.forEach((id) => {
            messageBranches[id] = false;
        });

        messageBranches[shownMessageId] = true;

        await db.members.put(
            {
                ...member,
                messageBranches,
            },
            member.id
        );
    });

    // 2. Save to API
    await apiUpdateConversation({
        body: {
            messageBranches,
        },
        path: { conversation_id: conversationId },
    });
}

export async function hideConversation(userId: string, conversationId: string) {
    // 1. Optimistically update local database
    await db.transaction("readwrite", db.members, async () => {
        const member = await db.members
            .where(["conversationId", "userId"])
            .equals([conversationId, userId])
            .first();

        if (!member) {
            throw new Error("Unable to find membership.");
        }

        await db.members.put(
            {
                ...member,
                hidden: true,
            },
            member.id
        );
    });

    // 2. Save to API
    await apiUpdateConversation({
        body: {
            hidden: true,
        },
        path: { conversation_id: conversationId },
    });
}

export async function showConversation(userId: string, conversationId: string) {
    // 1. Optimistically update local database
    await db.transaction("readwrite", db.members, async () => {
        const member = await db.members
            .where(["conversationId", "userId"])
            .equals([conversationId, userId])
            .first();

        if (!member) {
            throw new Error("Unable to find membership.");
        }

        await db.members.put(
            {
                ...member,
                hidden: false,
            },
            member.id
        );
    });

    // 2. Save to API
    await apiUpdateConversation({
        body: {
            hidden: false,
        },
        path: { conversation_id: conversationId },
    });
}

export async function setConversationLlms(
    userId: string,
    conversationId: string,
    llms: Array<LargeLanguageModel>
) {
    // 1. Optimistically update local database
    await db.transaction("readwrite", db.members, async () => {
        const member = await db.members
            .where(["conversationId", "userId"])
            .equals([conversationId, userId])
            .first();

        if (!member) {
            throw new Error("Unable to find membership.");
        }

        await db.members.put(
            {
                ...member,
                llmsSelected: llms,
            },
            member.id
        );
    });

    // 2. Save to API
    await apiUpdateConversation({
        body: {
            llmsSelected: llms,
        },
        path: { conversation_id: conversationId },
    });
}
