import { ReactNode, useEffect, useRef } from "react";

import { useIntervalEffect, useMountEffect } from "@react-hookz/web";
import ReconnectingWebSocket from "reconnecting-websocket";

import { globalSyncBootstrap } from "@/api";
import { useAnonUser } from "@/components/auth";

import { SyncData, addSyncedData } from "./database";

export function SyncProvider(props: { children: ReactNode }) {
    /**************************************************************************/
    /* State */
    const user = useAnonUser();

    const wsRef = useRef<ReconnectingWebSocket>(null);

    useEffect(() => {
        if (!user) return;

        wsRef.current = new ReconnectingWebSocket(`${window.location.origin}/ws/sync`, [], {
            connectionTimeout: 1000, // retry connect if not connected after this time, in ms
        });

        wsRef.current.addEventListener("message", (event) => {
            const data = JSON.parse(event.data) as SyncData;

            addSyncedData(data);
        });

        return () => wsRef.current?.close();
    }, [user]);

    // On startup, full bootstrap
    useMountEffect(() => {
        globalSyncBootstrap().then(({ data }) => {
            if (!data) {
                throw new Error("Unable to bootstrap");
            }

            // Save data locally
            data.forEach((value) => {
                addSyncedData(value);
            });
        });
    });

    // In case the WebSocket connection fails, sync data periodically
    useIntervalEffect(() => {
        // Pull the latest timestamp from local storage
        const bootstrapTimestamp = localStorage.getItem("bootstrap-timestamp");

        // Update timestamp for next bootstrap
        localStorage.setItem("bootstrap-timestamp", new Date().toISOString());

        globalSyncBootstrap({ query: { timestamp: bootstrapTimestamp } }).then(({ data }) => {
            if (!data) {
                throw new Error("Unable to bootstrap");
            }

            // Save data locally
            data.forEach((value) => {
                addSyncedData(value);
            });
        });
    }, 10000);

    /**************************************************************************/
    /* Render */
    return <>{props.children}</>;
}
