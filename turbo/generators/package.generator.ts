import { PlopTypes } from '@turbo/gen';
import { MergePackageJsonConfig } from '../actions/merge-package-json.action';

export const PackageGenerator: PlopTypes.PlopGeneratorConfig = {
    description: 'An example Turborepo generator - creates a new file at the root of the project',
    prompts: [
        {
            type: 'input',
            name: 'name',
            message: 'What is the name of the new package?',
            validate: (input: string) => {
                if (input.includes('.')) {
                    return 'package name cannot include an extension';
                }
                if (input.includes(' ')) {
                    return 'package name cannot include spaces';
                }
                if (input.toLowerCase() !== input) {
                    return 'package name may only contain lower case characters';
                }
                if (!input) {
                    return 'package name is required';
                }
                return true;
            }
        },
        {
            type: 'list',
            name: 'package-type',
            message: 'How will this package be used?',
            choices: [
                {
                    name: 'private - It will be used only inside this project and not released on npm',
                    short: 'private',
                    value: 'package'
                },
                {
                    name: 'public - It will be used inside this project and also released on npm for use by other projects',
                    short: 'public',
                    value: 'public-package'
                }
            ]
        }
    ],
    actions: [
        {
            type: 'addMany',
            destination: '{{ turbo.paths.root }}/{{ package-type }}s/{{ name }}',
            templateFiles: '../templates/package/common/**/*',
            base: '../templates/package/common',
            globOptions: {
                dot: true
            }
        },
        {
            type: 'addMany',
            destination: '{{ turbo.paths.root }}/{{ package-type }}s/{{ name }}',
            templateFiles: '../templates/package/{{ package-type }}/**/*',
            base: '../templates/package/{{ package-type }}',
            globOptions: {
                dot: true
            },
            force: true
        },
        {
            type: 'merge-package-json',
            templateFile: './turbo/templates/package/common/package.json',
            packageFile: '{{ turbo.paths.root }}/{{ package-type }}s/{{ name }}/package.json'
        } as MergePackageJsonConfig,
        {
            type: 'pnpm-install'
        }
    ]
};
