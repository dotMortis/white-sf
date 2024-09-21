export type EventType<EVENTS extends EventMap<EVENTS>> = Extract<keyof EVENTS, string>;

export type EventArgs<
    EVENTS extends EventMap<EVENTS>,
    EVENT extends EventType<EVENTS>
> = Parameters<EVENTS[EVENT]>;

export type EventListener<
    EVENTS extends EventMap<EVENTS>,
    EVENT extends EventType<EVENTS>
> = EVENTS[EVENT];

export type EventMap<T> = {
    [E in keyof T]: T[E] extends (...args: infer ARGS) => void ? (...args: ARGS) => void : never;
};

export interface Listenable<EVENTS extends EventMap<EVENTS>> {
    emit<EVENT extends EventType<EVENTS>>(event: EVENT, ...args: EventArgs<EVENTS, EVENT>): void;
    on<EVENT extends EventType<EVENTS>>(event: EVENT, listener: EventListener<EVENTS, EVENT>): void;
    remove<EVENT extends EventType<EVENTS>>(
        event: EVENT,
        listener: EventListener<EVENTS, EVENT>
    ): void;
}
