import { makeAutoObservable } from "mobx";

import { ConversationStore } from "./conversation-store";
import { MemberStore } from "./member-store";
import { MessageStore } from "./message-store";
import { UserStore } from "./user-store";

export class RootStore {
    messageStore: MessageStore;
    conversationStore: ConversationStore;
    memberStore: MemberStore;
    userStore: UserStore;

    constructor() {
        this.messageStore = new MessageStore();
        this.conversationStore = new ConversationStore();
        this.memberStore = new MemberStore();
        this.userStore = new UserStore();

        makeAutoObservable(this);
    }

    // Cross-store computed values and actions

    // Get messages for the current conversation
    get currentConversationMessages() {
        const currentConversationId = this.conversationStore.currentConversationId;
        if (!currentConversationId) return [];

        return this.messageStore.getMessagesByConversationId(currentConversationId);
    }

    // Get members for the current conversation
    get currentConversationMembers() {
        const currentConversationId = this.conversationStore.currentConversationId;
        if (!currentConversationId) return [];

        return this.memberStore.getVisibleMembersByConversationId(currentConversationId);
    }

    // Get the current user's member record for the current conversation
    get currentUserMember() {
        const currentConversationId = this.conversationStore.currentConversationId;
        const currentUserId = this.userStore.currentUserId;

        if (!currentConversationId || !currentUserId) return null;

        return this.memberStore.getMemberByUserAndConversation(
            currentUserId,
            currentConversationId
        );
    }

    // Check if current user is owner of current conversation
    get isCurrentUserConversationOwner() {
        const currentConversation = this.conversationStore.currentConversation;
        const currentUserId = this.userStore.currentUserId;

        if (!currentConversation || !currentUserId) return false;

        return currentConversation.ownerId === currentUserId;
    }

    // Get user details for a given user ID
    getUserById(userId: string) {
        return this.userStore.getUser(userId);
    }

    // Get conversation details for a given conversation ID
    getConversationById(conversationId: string) {
        return this.conversationStore.getConversation(conversationId);
    }

    // Clear all stores (for logout)
    clearAll() {
        this.messageStore.setMessages([]);
        this.conversationStore.setConversations([]);
        this.memberStore.setMembers([]);
        this.userStore.logout();
    }

    // Check if any store is loading
    get isLoading() {
        return (
            this.messageStore.isLoading ||
            this.conversationStore.isLoading ||
            this.memberStore.isLoading ||
            this.userStore.isLoading
        );
    }

    // Get all errors from stores
    get errors() {
        return [
            this.messageStore.error,
            this.conversationStore.error,
            this.memberStore.error,
            this.userStore.error,
        ].filter((error) => error !== null);
    }

    // Check if there are any errors
    get hasErrors() {
        return this.errors.length > 0;
    }
}

// Create a singleton instance
export const rootStore = new RootStore();
