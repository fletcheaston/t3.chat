import Dexie, { type EntityTable } from "dexie";

import { GlobalSyncTypesResponses, SyncConversation, SyncMessage, SyncTag } from "@/api";

export type SyncData = GlobalSyncTypesResponses["200"];

const db = new Dexie("Drawing") as Dexie & {
    messages: EntityTable<SyncMessage["data"], "id">;
    conversations: EntityTable<SyncConversation["data"], "id">;
    tags: EntityTable<SyncTag["data"], "id">;
};

db.version(1).stores({
    messages: "id,created",
    conversations: "id,created",
    tags: "id,created",
});

export function addSyncedData(value: SyncData) {
    switch (value.type) {
        case "message": {
            db.messages.put(value.data, value.data.id);
            return;
        }

        case "conversation": {
            db.conversations.put(value.data, value.data.id);
            return;
        }

        case "tag": {
            db.tags.put(value.data, value.data.id);
            return;
        }

        default:
            return value satisfies never;
    }
}

export { db };
