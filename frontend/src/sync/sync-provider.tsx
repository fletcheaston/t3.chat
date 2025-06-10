import React, { useEffect, useRef } from "react";

import ReconnectingWebSocket from "reconnecting-websocket";

import { apiUrl } from "@/env";

import { SyncData, addSyncedData } from "./database";

export function AppSyncProvider(props: { children: React.ReactNode }) {
    const wsRef = useRef<ReconnectingWebSocket>(null);

    useEffect(() => {
        wsRef.current = new ReconnectingWebSocket(`${apiUrl}/ws/sync`, [], {
            connectionTimeout: 1000, // retry connect if not connected after this time, in ms
        });

        wsRef.current.addEventListener("message", (event) => {
            const data = JSON.parse(event.data) as SyncData;

            addSyncedData(data);
        });

        return () => wsRef.current?.close();
    }, []);

    return <>{props.children}</>;
}
