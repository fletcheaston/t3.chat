import React, { createContext, useContext, useState } from "react";

import { useMountEffect } from "@react-hookz/web";

import { UserSchema, whoAmI } from "@/api/client";
import { client } from "@/api/client/client.gen";

const UserContext = createContext<UserSchema | null>(null);

export function AuthProvider(props: { children: React.ReactNode }) {
    /**************************************************************************/
    /* State */
    const [user, setUser] = useState<UserSchema | undefined | null>(undefined);

    useMountEffect(() => {
        whoAmI()
            .then((result) => {
                if (result.data?.user) {
                    setUser(result.data.user);

                    client.setConfig({
                        headers: {
                            "X-CSRFToken": result.data.csrfToken,
                        },
                    });

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
