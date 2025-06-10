import { useRef } from "react";

import { useLiveQuery } from "dexie-react-hooks";

export function useCachedLiveQuery<T>(callback: () => Promise<T>, deps: any[]): T | undefined {
    const cacheRef = useRef<T | undefined>(undefined);

    const result = useLiveQuery(callback, deps);

    if (result !== undefined) {
        cacheRef.current = result;
    }

    return cacheRef.current;
}
