import React, { createContext, useContext, useState } from "react";

import { useMountEffect } from "@react-hookz/web";

import { AuthUserSchema, checkLogin } from "@/api/client";
import { Loading } from "@/ui/loading";

const UserContext = createContext<AuthUserSchema | null>(null);

export function AuthProvider(props: { children: React.ReactNode }) {
    /**************************************************************************/
    /* State */
    const [user, setUser] = useState<AuthUserSchema | undefined | null>(undefined);

    useMountEffect(() => {
        checkLogin()
            .then((result) => {
                if (result.data?.authUser) {
                    setUser(result.data.authUser);
                }
            })
            .catch(() => {
                setUser(null);
            });
    });

    /**************************************************************************/
    /* Render */
    if (user === undefined) {
        return <Loading />;
    }

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
