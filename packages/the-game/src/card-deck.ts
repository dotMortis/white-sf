import { randomInt } from 'crypto';
import { Card } from './card.js';

export class CardDeck {
    private readonly _cards: ReadonlyArray<Card>;
    private _currentDeck: Array<Card>;

    constructor(cards: ReadonlyArray<Card>) {
        this._currentDeck = (this._cards = cards).slice();
    }

    reset(): void {
        this._currentDeck = this._cards.slice();
    }

    draw(): Card {
        const nextCard = this._currentDeck.splice(this._randomIndex(), 1)[0];
        if (nextCard == null) {
            throw new Error('Can not draw from empty deck');
        }
        return nextCard;
    }

    private _randomIndex(): number {
        return randomInt(0, this._currentDeck.length - 1);
    }
}
