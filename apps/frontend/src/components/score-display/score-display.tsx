import './score-display.css';

export type ScoreDisplayProperties = {
    dealerScore: number;
    playerScore: number;
};

export const ScoreDisplay = (properties: ScoreDisplayProperties) => {
    const { dealerScore, playerScore } = properties;
    return (
        <div className='score-display'>
            <div className='panel'>
                <span className='dealer score'>{dealerScore.toFixed(0)}</span>
                <div className='separator'></div>
                <span className='player score'>{playerScore.toFixed(0)}</span>
            </div>
        </div>
    );
};
