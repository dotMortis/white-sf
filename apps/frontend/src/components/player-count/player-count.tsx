import './player-count.css';

export type PlayerCountProperties = {
    count: number;
    required: number;
};

export const PlayerCount = (properties: PlayerCountProperties) => {
    const { count, required } = properties;
    return (
        <div className='player-count'>
            <div className='panel'>
                Spieler: {count} (Mindestens {required} benötigt)
            </div>
        </div>
    );
};
