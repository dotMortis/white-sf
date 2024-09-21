import './loading-spinner.css';

export type LoadingSpinnerProperties = {
    size?: string;
};

export const LoadingSpinner = (properties: LoadingSpinnerProperties) => {
    const { size } = properties;
    return (
        <div className='lds-circle' style={{ '--spinner-size': size }}>
            <div></div>
        </div>
    );
};
