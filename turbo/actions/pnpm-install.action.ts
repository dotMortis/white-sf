import { PlopTypes } from '@turbo/gen';
import { exec } from 'child_process';

export const PnpmInstallAction: PlopTypes.CustomActionFunction = (answers, config, plop) => {
    const process = exec(`pnpm install`);
    return new Promise((resolve, reject) => {
        process.once('exit', code => {
            if (code === 0) {
                resolve('pnpm install successful');
            } else {
                reject('pnpm install failed');
            }
        });
    });
};
