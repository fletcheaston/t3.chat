import { ComponentType, FC, FunctionComponent, ReactNode, createContext, useContext } from "react";

import { observer } from "mobx-react-lite";

import { RootStore, rootStore } from "./root-store";

// Create context
const StoreContext = createContext<RootStore | null>(null);

// Provider component
interface StoreProviderProps {
    children: ReactNode;
    store?: RootStore;
}

export const StoreProvider: FC<StoreProviderProps> = ({ children, store = rootStore }) => {
    return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
};

// Hook to use the store
export const useStore = (): RootStore => {
    const store = useContext(StoreContext);
    if (!store) {
        throw new Error("useStore must be used within a StoreProvider");
    }
    return store;
};

// Individual store hooks for convenience
export const useMessageStore = () => {
    const { messageStore } = useStore();
    return messageStore;
};

export const useConversationStore = () => {
    const { conversationStore } = useStore();
    return conversationStore;
};

export const useMemberStore = () => {
    const { memberStore } = useStore();
    return memberStore;
};

export const useUserStore = () => {
    const { userStore } = useStore();
    return userStore;
};

// Higher-order component for making components reactive to MobX changes
export const withStore = <P extends object>(Component: ComponentType<P>): ComponentType<P> => {
    return observer(Component as FunctionComponent<P>);
};
