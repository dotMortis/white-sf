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
                    <img class='icon-bank' src={`${ServerUrl}/static/yugioh/bank.png`}></img>
                    <span className='dealer score'>{dealerScore.toFixed(0)}</span>
                </div>
                <div className='separator'></div>
                <div className='row'>
                    <img class='icon-player' src={`${ServerUrl}/static/yugioh/human.png`}></img>
                    <span className='player score'>{playerScore.toFixed(0)}</span>
                </div>
            </div>
        </div>
    );
};
