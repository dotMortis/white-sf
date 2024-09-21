import { HTMLAttributes } from 'preact/compat';
import './overlay.css';

export type OverlayProperties = {
    open?: boolean;
    children?: HTMLAttributes<HTMLElement>['children'];
};

export const Overlay = (properties: OverlayProperties) => {
    const { open, children } = properties;
    return <div className={open === true ? 'overlay open' : 'overlay'}>{children}</div>;
};
