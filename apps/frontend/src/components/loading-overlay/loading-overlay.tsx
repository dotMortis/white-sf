import { LoadingSpinner } from '../loading-spinner/loading-spinner.js';
import { Overlay, OverlayProperties } from '../overlay/overlay.js';
import './loading-overlay.css';

export type LoadingOverlayProperties = OverlayProperties;

export const LoadingOverlay = (properties: LoadingOverlayProperties) => {
    return (
        <Overlay {...properties}>
            <div className='loading-overlay'>
                <div className='content'>
                    <LoadingSpinner />
                    <p>Verbinde mit Server...</p>
                </div>
            </div>
        </Overlay>
    );
};
