import './vote-chart.css';

export type VoteChartProperties = {
    votes: readonly [number, number];
    categories: readonly [string, string];
};

export const VoteChart = (properties: VoteChartProperties) => {
    const { votes, categories } = properties;

    const total = votes.reduce((sum, value) => sum + value, 0) || 1;
    const percentages = votes.map(count => count / total);

    return (
        <div className='vote-chart'>
            <h1>Abstimmung</h1>
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
                        {category}
                    </div>
                ))}
            </div>
        </div>
    );
};
