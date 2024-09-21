import { useEffect, useState } from 'preact/hooks';
import './vote-chart.css';

export type VoteChartProperties = {
    votes: readonly [number, number];
    categories: readonly [string, string];
    until: number;
};

export const VoteChart = (properties: VoteChartProperties) => {
    const { votes, categories, until } = properties;
    const [progress, setProgress] = useState(0);

    const total = votes.reduce((sum, value) => sum + value, 0) || 1;
    const percentages = votes.map(count => count / total);

    useEffect(() => {
        let running = true;

        let handle = -1;

        const start = Date.now();
        const duration = (until - start) / 1000;
        const updateProgress = () => {
            const now = Date.now();
            const timeLeft = Math.max((until - now) / 1000, 0);
            const progress = 1 - timeLeft / duration;
            setProgress(progress);

            if (now >= until) {
                running = false;
            }

            if (running) {
                handle = requestAnimationFrame(updateProgress);
            }
        };
        updateProgress();

        return () => {
            running = false;
            cancelAnimationFrame(handle);
        };
    }, [until]);

    return (
        <div className='vote-chart'>
            <h1>Abstimmung</h1>
            <div
                className='progress-bar'
                style={{ '--percentage': `${((progress ?? 0) * 100).toFixed(2)}%` }}></div>
            <div className='bars'>
                {percentages.map((percentage, i) => (
                    <div
                        key={i}
                        className='bar'
                        style={{ '--percentage': `${(percentage * 100).toFixed(2)}%` }}></div>
                ))}
            </div>
            <div className='categories'>
                {categories.map((category, i) => (
                    <div key={i} className='category'>
                        <div>{category}</div>
                        <div>{votes[i]}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};
