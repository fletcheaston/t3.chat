import React, { createContext, useContext, useState } from "react";

import { useMountEffect } from "@react-hookz/web";

import { AuthUserSchema, whoAmI } from "@/api/client";

const UserContext = createContext<AuthUserSchema | null>(null);

export function AuthProvider(props: { children: React.ReactNode }) {
    /**************************************************************************/
    /* State */
    const [user, setUser] = useState<AuthUserSchema | undefined | null>(undefined);

    useMountEffect(() => {
        whoAmI()
            .then((result) => {
                if (result.data?.authUser) {
                    setUser(result.data.authUser);
                    return;
                }

                setUser(null);
            })
            .catch(() => {
                setUser(null);
            });
    });

    /**************************************************************************/
    /* Render */
    if (user === undefined) return null;

    return <UserContext.Provider value={user}>{props.children}</UserContext.Provider>;
}

export function useAnonUser() {
    return useContext(UserContext);
}

export function useUser() {
    const user = useAnonUser();

    if (user === null) {
        throw new Error("Unauthenticated user.");
    }

    return user;
}
