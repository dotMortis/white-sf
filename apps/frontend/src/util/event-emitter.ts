import { EventArgs, EventListener, EventMap, EventType, Listenable } from './listenable.js';

export class EventEmitter<EVENTS extends EventMap<EVENTS>> implements Listenable<EVENTS> {
    private readonly _listeners: Map<
        EventType<EVENTS>,
        Set<EventListener<EVENTS, Extract<keyof EVENTS, string>>>
    >;

    constructor() {
        this._listeners = new Map();
    }

    emit<EVENT extends EventType<EVENTS>>(event: EVENT, ...args: EventArgs<EVENTS, EVENT>): void {
        const listeners = this._listeners.get(event);
        if (listeners == null) {
            return;
        }
        listeners.forEach(l => l(...args));
    }

    on<EVENT extends EventType<EVENTS>>(
        event: EVENT,
        listener: EventListener<EVENTS, EVENT>
    ): void {
        const listeners = this._listeners.get(event);
        if (listeners == null) {
            this._listeners.set(event, new Set([listener]));
        } else {
            listeners.add(listener);
        }
    }

    remove<EVENT extends EventType<EVENTS>>(
        event: EVENT,
        listener: EventListener<EVENTS, EVENT>
    ): void {
        const listeners = this._listeners.get(event);
        if (listeners == null) {
            return;
        }

        listeners.delete(listener);
    }

    destroy(): void {
        this._listeners.clear();
    }
}
