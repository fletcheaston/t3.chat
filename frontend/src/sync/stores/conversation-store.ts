import { makeAutoObservable, runInAction } from "mobx";

import { ConversationSchema } from "@/api";

export class ConversationStore {
    conversations = new Map<string, ConversationSchema>();
    isLoading = false;
    error: string | null = null;
    currentConversationId: string | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    // Actions
    setConversations(conversations: ConversationSchema[]) {
        runInAction(() => {
            this.conversations.clear();
            conversations.forEach((conversation) => {
                this.conversations.set(conversation.id, conversation);
            });
        });
    }

    addConversation(conversation: ConversationSchema) {
        runInAction(() => {
            this.conversations.set(conversation.id, conversation);
        });
    }

    updateConversation(conversationId: string, updates: Partial<ConversationSchema>) {
        runInAction(() => {
            const existing = this.conversations.get(conversationId);
            if (existing) {
                this.conversations.set(conversationId, { ...existing, ...updates });
            }
        });
    }

    removeConversation(conversationId: string) {
        runInAction(() => {
            this.conversations.delete(conversationId);
            if (this.currentConversationId === conversationId) {
                this.currentConversationId = null;
            }
        });
    }

    setCurrentConversation(conversationId: string | null) {
        runInAction(() => {
            this.currentConversationId = conversationId;
        });
    }

    setLoading(loading: boolean) {
        runInAction(() => {
            this.isLoading = loading;
        });
    }

    setError(error: string | null) {
        runInAction(() => {
            this.error = error;
        });
    }

    // Computed getters
    get allConversations(): ConversationSchema[] {
        return Array.from(this.conversations.values());
    }

    get sortedConversations(): ConversationSchema[] {
        return this.allConversations.sort(
            (a, b) => new Date(b.modified).getTime() - new Date(a.modified).getTime()
        );
    }

    get currentConversation(): ConversationSchema | null {
        if (!this.currentConversationId) return null;
        return this.conversations.get(this.currentConversationId) || null;
    }

    getConversation(conversationId: string): ConversationSchema | undefined {
        return this.conversations.get(conversationId);
    }

    getConversationsByOwner(ownerId: string): ConversationSchema[] {
        return this.allConversations.filter((conversation) => conversation.ownerId === ownerId);
    }

    searchConversations(query: string): ConversationSchema[] {
        if (!query.trim()) return this.sortedConversations;

        const lowerQuery = query.toLowerCase();
        return this.allConversations
            .filter((conversation) => conversation.title.toLowerCase().includes(lowerQuery))
            .sort((a, b) => new Date(b.modified).getTime() - new Date(a.modified).getTime());
    }

    get recentConversations(): ConversationSchema[] {
        return this.sortedConversations.slice(0, 10);
    }
}
