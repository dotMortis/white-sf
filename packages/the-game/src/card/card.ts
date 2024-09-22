import { MAX_POINTS } from '../global-values.js';
import { CardSuite } from './card-suite.js';

export class Card {
    private readonly _values: readonly [number, number];
    private readonly _name: string;
    private readonly _suite: CardSuite;

    constructor(name: string, suite: CardSuite, values: readonly [number, number]) {
        this._values = values;
        this._name = name;
        this._suite = suite;
    }

    get name(): string {
        return this._name;
    }

    get suite(): CardSuite {
        return this._suite;
    }

    get id(): string {
        return `${this._name}_${this._suite}`;
    }

    encode(): EncodedCard {
        return {
            id: this.id,
            name: this.name,
            suite: this.suite
        };
    }

    getValueFor(currentPoints: number): number {
        const newMaxPointOne = currentPoints + this._values[0];
        const newMaxPointTwo = currentPoints + this._values[1];
        return newMaxPointOne > MAX_POINTS && newMaxPointTwo <= MAX_POINTS
            ? this._values[1]
            : newMaxPointTwo === MAX_POINTS
              ? this._values[1]
              : this._values[0];
    }
}

export type EncodedCard = {
    name: string;
    suite: CardSuite;
    id: string;
};
