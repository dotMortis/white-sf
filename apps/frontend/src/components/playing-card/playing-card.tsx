import { HTMLAttributes } from 'preact/compat';
import './playing-card.css';

export type PlayingCardProperties = {
    className?: HTMLAttributes<HTMLElement>['className'];
};

export const PlayingCard = (properties: PlayingCardProperties) => {
    const { className } = properties;
    return (
        <div className={className == null ? 'playing-card' : `playing-card ${className}`}>Card</div>
    );
};
