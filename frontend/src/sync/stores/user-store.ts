import { makeAutoObservable, runInAction } from "mobx";

import { UserSchema } from "@/api";

export class UserStore {
    users = new Map<string, UserSchema>();
    currentUser: UserSchema | null = null;
    isLoading = false;
    error: string | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    // Actions
    setUsers(users: UserSchema[]) {
        runInAction(() => {
            this.users.clear();
            users.forEach((user) => {
                this.users.set(user.id, user);
            });
        });
    }

    addUser(user: UserSchema) {
        runInAction(() => {
            this.users.set(user.id, user);
        });
    }

    updateUser(userId: string, updates: Partial<UserSchema>) {
        runInAction(() => {
            const existing = this.users.get(userId);
            if (existing) {
                const updatedUser = { ...existing, ...updates };
                this.users.set(userId, updatedUser);

                // Update current user if it's the same
                if (this.currentUser?.id === userId) {
                    this.currentUser = updatedUser;
                }
            }
        });
    }

    removeUser(userId: string) {
        runInAction(() => {
            this.users.delete(userId);

            // Clear current user if it's the same
            if (this.currentUser?.id === userId) {
                this.currentUser = null;
            }
        });
    }

    setCurrentUser(user: UserSchema | null) {
        runInAction(() => {
            this.currentUser = user;
            if (user) {
                this.users.set(user.id, user);
            }
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
    get allUsers(): UserSchema[] {
        return Array.from(this.users.values());
    }

    get sortedUsers(): UserSchema[] {
        return this.allUsers.sort((a, b) => a.name.localeCompare(b.name));
    }

    getUser(userId: string): UserSchema | undefined {
        return this.users.get(userId);
    }

    searchUsers(query: string): UserSchema[] {
        if (!query.trim()) return this.sortedUsers;

        const lowerQuery = query.toLowerCase();
        return this.allUsers
            .filter((user) => user.name.toLowerCase().includes(lowerQuery))
            .sort((a, b) => a.name.localeCompare(b.name));
    }

    // Check if user is authenticated
    get isAuthenticated(): boolean {
        return this.currentUser !== null;
    }

    // Get current user ID
    get currentUserId(): string | null {
        return this.currentUser?.id || null;
    }

    // Check if a user ID is the current user
    isCurrentUser(userId: string): boolean {
        return this.currentUser?.id === userId;
    }

    // Logout - clear current user
    logout() {
        runInAction(() => {
            this.currentUser = null;
        });
    }
}
