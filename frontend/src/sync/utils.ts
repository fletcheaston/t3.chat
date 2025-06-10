import { useRef } from "react";

import { useLiveQuery } from "dexie-react-hooks";

export function useCachedLiveQuery<T>(callback: () => Promise<T>, deps: any[]): T | undefined {
    const cacheRef = useRef<T | undefined>(undefined);

    const data = useLiveQuery(callback, deps);

    if (data !== undefined) {
        cacheRef.current = data;
    }

    return cacheRef.current;
}
