import React, { useEffect, useRef } from "react";

import ReconnectingWebSocket from "reconnecting-websocket";

import { useAnonUser } from "@/api/auth";
import { apiUrl } from "@/env";

import { SyncData, addSyncedData } from "./database";

export function SyncProvider(props: { children: React.ReactNode }) {
    /**************************************************************************/
    /* State */
    const user = useAnonUser();

    const wsRef = useRef<ReconnectingWebSocket>(null);

    useEffect(() => {
        if (!user) return;

        wsRef.current = new ReconnectingWebSocket(`${apiUrl}/ws/sync`, [], {
            connectionTimeout: 1000, // retry connect if not connected after this time, in ms
        });

        wsRef.current.addEventListener("message", (event) => {
            const data = JSON.parse(event.data) as SyncData;

            addSyncedData(data);
        });

        return () => wsRef.current?.close();
    }, [user]);

    /**************************************************************************/
    /* Render */
    return <>{props.children}</>;
}
