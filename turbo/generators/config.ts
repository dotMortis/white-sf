import { PlopTypes } from '@turbo/gen';
import { MergePackageJsonAction } from '../actions/merge-package-json.action';
import { PnpmInstallAction } from '../actions/pnpm-install.action';
import { AppGenerator } from './apps.generator';
import { PackageGenerator } from './package.generator';

export default function generator(plop: PlopTypes.NodePlopAPI): void {
    plop.setActionType('pnpm-install', PnpmInstallAction);
    plop.setActionType('merge-package-json', MergePackageJsonAction);

    plop.setGenerator('app', AppGenerator);
    plop.setGenerator('package', PackageGenerator);
}
