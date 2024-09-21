import { Card, EncodedCard } from './card.js';

export class Player<NAME extends string = string> {
    private readonly _name: NAME;
    private readonly _cards: Array<Card>;
    private _points: number;

    constructor(name: NAME) {
        this._name = name;
        this._cards = [];
        this._points = 0;
    }

    get name(): NAME {
        return this._name;
    }

    get points(): number {
        return this._points;
    }

    get encodedCards(): Array<EncodedCard> {
        return this._cards.map(card => card.encode());
    }

    addCard(card: Card): void {
        this._cards.push(card);
        this._points += card.getValueFor(this._points);
    }

    resetHand(): void {
        this._cards.length = 0;
    }
}
