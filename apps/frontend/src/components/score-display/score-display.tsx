import './score-display.css';

export const ScoreDisplay = () => {
    return (
        <div className='score-display'>
            <div className='panel'>
                <span className='dealer score'>0</span>
                <div className='separator'></div>
                <span className='player score'>0</span>
            </div>
        </div>
    );
};
