import { PlopTypes } from '@turbo/gen';
import { readFile, writeFile } from 'fs/promises';
import { resolve } from 'path';

export interface MergePackageJsonConfig extends PlopTypes.ActionConfig {
    templateFile: string;
    packageFile: string;
}

const rendered = (value: unknown, render: (s: string) => string): unknown => {
    if (typeof value !== 'string') {
        return value;
    }
    return render(value);
};

const merged = (
    base: Record<string, unknown>,
    specific: Record<string, unknown>,
    render: (s: string) => string
): Record<string, unknown> => {
    const mergedObj: Record<string, unknown> = {};
    const allKeys = [...Object.keys(base), ...Object.keys(specific)];
    for (const key of allKeys) {
        if (!(key in specific)) {
            mergedObj[key] = rendered(base[key], render);
        } else if (!(key in base)) {
            mergedObj[key] = rendered(specific[key], render);
        } else {
            if (typeof base[key] !== typeof specific[key]) {
                throw new Error('Cannot merge properties of different types');
            }

            if (typeof base[key] !== 'object') {
                mergedObj[key] = rendered(specific[key], render);
            } else {
                mergedObj[key] = merged(
                    base[key] as Record<string, unknown>,
                    specific[key] as Record<string, unknown>,
                    render
                );
            }
        }
    }
    return mergedObj;
};

export const MergePackageJsonAction: PlopTypes.CustomActionFunction = async (
    answers,
    config,
    plop
) => {
    if (config === undefined) {
        throw new Error('No config specified');
    }
    const mergeConfig = config as MergePackageJsonConfig;
    const parsedTemplatePath = plop?.renderString(mergeConfig.templateFile, answers);
    const parsedPackagePath = plop?.renderString(mergeConfig.packageFile, answers);
    if (parsedTemplatePath === undefined) {
        throw new Error('No template file specified');
    }
    if (parsedPackagePath === undefined) {
        throw new Error('No package file specified');
    }

    const templateContent = await readFile(resolve(parsedTemplatePath));
    const packageContent = await readFile(resolve(parsedPackagePath));

    const templateConfig = JSON.parse(templateContent.toString());
    const packageConfig = JSON.parse(packageContent.toString());

    const mergedConfig = merged(
        templateConfig,
        packageConfig,
        s => plop?.renderString(s, answers) ?? s
    );
    await writeFile(resolve(parsedPackagePath), JSON.stringify(mergedConfig, null, 4));

    return 'Done';
};
