import { useEffect, useMemo, useState } from 'preact/hooks';
import { BackendSocket } from '../backend/backend-socket.js';

export const useBackend = (url: string): readonly [BackendSocket, boolean] => {
    const backend = useMemo(() => new BackendSocket(url), []);
    const [backendReady, setBackendReady] = useState(false);
    const [tryCount, setTryCount] = useState(1);

    useEffect(() => {
        if (backendReady) {
            return;
        }

        backend.connect().then(
            () => {
                setBackendReady(true);
                setTryCount(0);
            },
            () => {
                console.log(`Could not connect to backend, retrying... (${tryCount})`);
                setBackendReady(false);
                setTryCount(tryCount + 1);
            }
        );
    }, [tryCount]);

    return [backend, backendReady];
};
