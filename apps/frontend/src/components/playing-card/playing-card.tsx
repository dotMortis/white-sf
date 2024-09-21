import { EncodedCard } from '@internal/the-game/card';
import { HTMLAttributes } from 'preact/compat';
import { ServerUrl } from '../../index.js';
import './playing-card.css';

export type PlayingCardProperties = {
    className?: HTMLAttributes<HTMLElement>['className'];
    card: EncodedCard;
};

export const PlayingCard = (properties: PlayingCardProperties) => {
    const { className, card } = properties;
    return (
        <div
            className={className == null ? 'playing-card' : `playing-card ${className}`}
            style={{ backgroundImage: `url(${ServerUrl}/static/cards/${card.id}.png)` }}></div>
    );
};
