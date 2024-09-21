import { ServerUrl } from '../../index.js';
import './player-count.css';

export type PlayerCountProperties = {
    count: number;
    required: number;
};

export const PlayerCount = (properties: PlayerCountProperties) => {
    const { count, required } = properties;
    return (
        <div className='player-count'>
            <img src={`${ServerUrl}/static/waiting.png`}></img>
            <div className='panel'>
                Spieler: {count} (Mindestens {required} benötigt)
            </div>
        </div>
    );
};
