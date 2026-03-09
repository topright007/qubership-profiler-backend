import React, { type ReactNode, useCallback, useContext, useMemo, useState } from 'react';

type SetStateAction<S> = (prev: S) => S;
type SetState<S> = (action: Partial<S> | SetStateAction<S>) => void;

export function createStoreContext<S>(initialState: S): {
    Provider: React.FC<{ children?: ReactNode }>;
    useStore: () => [S, SetState<S>];
    useStoreSelector: <T>(selector: (state: S) => T) => T;
} {
    const StoreContext = React.createContext<{ state: S; setState: React.Dispatch<React.SetStateAction<S>> } | null>(null);

    const Provider: React.FC<{ children?: ReactNode }> = ({ children }) => {
        const [state, setState] = useState<S>(initialState);
        const value = useMemo(() => ({ state, setState }), [state]);
        return React.createElement(StoreContext.Provider, { value }, children);
    };

    function useStore(): [S, SetState<S>] {
        const ctx = useContext(StoreContext);
        if (!ctx) throw new Error('useStore must be used within StoreContext.Provider');
        const set = useCallback(
            (action: Partial<S> | SetStateAction<S>) => {
                ctx.setState(prev =>
                    typeof action === 'function' ? (action as SetStateAction<S>)(prev) : { ...prev, ...action }
                );
            },
            [ctx.setState]
        );
        return [ctx.state, set];
    }

    function useStoreSelector<T>(selector: (state: S) => T): T {
        const ctx = useContext(StoreContext);
        if (!ctx) throw new Error('useStoreSelector must be used within StoreContext.Provider');
        return selector(ctx.state);
    }

    return { Provider, useStore, useStoreSelector };
}
