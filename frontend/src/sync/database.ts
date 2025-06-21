import Dexie, { type EntityTable } from "dexie";

import {
    GlobalSyncTypesResponses,
    SyncConversation,
    SyncMember,
    SyncMessage,
    SyncUser,
} from "@/api";

export type SyncData = GlobalSyncTypesResponses["200"];

const db = new Dexie("F3Chat") as Dexie & {
    messages: EntityTable<SyncMessage["data"], "id">;
    conversations: EntityTable<SyncConversation["data"], "id">;
    members: EntityTable<SyncMember["data"], "id">;
    users: EntityTable<SyncUser["data"], "id">;
};

db.version(1).stores({
    messages: "id,conversationId,replyToId,authorId,created",
    conversations: "id,created",
    members: "id,conversationId,userId,[conversationId+userId],created",
    users: "id,created",
});

export function addSyncedData(value: SyncData) {
    switch (value.type) {
        case "message": {
            db.transaction("readwrite", db.messages, async () => {
                const stored = await db.messages.get(value.data.id);

                if (!stored) {
                    // Add it if we don't have an object for this id yet
                    db.messages.add(value.data, value.data.id);
                    return;
                }

                // If we've got a newer value, update it
                if (new Date(value.data.modified) > new Date(stored.modified)) {
                    db.messages.put(value.data, value.data.id);
                }
            });

            return;
        }

        case "conversation": {
            db.transaction("readwrite", db.conversations, async () => {
                const stored = await db.conversations.get(value.data.id);

                if (!stored) {
                    // Add it if we don't have an object for this id yet
                    db.conversations.add(value.data, value.data.id);
                    return;
                }

                // If we've got a newer value, update it
                if (new Date(value.data.modified) > new Date(stored.modified)) {
                    db.conversations.put(value.data, value.data.id);
                }
            });
            return;
        }

        case "member": {
            db.transaction("readwrite", db.members, async () => {
                const stored = await db.members.get(value.data.id);

                if (!stored) {
                    // Add it if we don't have an object for this id yet
                    db.members.add(value.data, value.data.id);
                    return;
                }

                // If we've got a newer value, update it
                if (new Date(value.data.modified) > new Date(stored.modified)) {
                    db.members.put(value.data, value.data.id);
                }
            });
            return;
        }

        case "user": {
            db.users.put(value.data, value.data.id);
            return;
        }

        default:
            return value satisfies never;
    }
}

export { db };
