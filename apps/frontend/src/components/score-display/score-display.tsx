import { ServerUrl } from '../../index.js';
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
                <div className='row'>
                    <div className='icon'>
                        <img src={`${ServerUrl}/static/yugioh/bank.png`}></img>
                    </div>
                    <span className='dealer score'>{dealerScore.toFixed(0)}</span>
                </div>
                <div className='separator'></div>
                <div className='row'>
                    <div className='icon'>
                        <img src={`${ServerUrl}/static/yugioh/human.png`}></img>
                    </div>
                    <span className='player score'>{playerScore.toFixed(0)}</span>
                </div>
            </div>
        </div>
    );
};
