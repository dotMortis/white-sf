import { PlopTypes } from '@turbo/gen';
import { MergePackageJsonConfig } from '../actions/merge-package-json.action';

export const AppGenerator: PlopTypes.PlopGeneratorConfig = {
    description: 'Add a new app project',
    prompts: [
        {
            type: 'input',
            name: 'app-name',
            message: 'What is the name of the new app?',
            validate: (input: string) => {
                if (input.includes('.')) {
                    return 'app name cannot include an extension';
                }
                if (input.includes(' ')) {
                    return 'app name cannot include spaces';
                }
                if (input.toLowerCase() !== input) {
                    return 'app name may only contain lower case characters';
                }
                if (!input) {
                    return 'app name is required';
                }
                return true;
            }
        },
        {
            type: 'list',
            name: 'app-type',
            message: 'What kind of app do you want to create?',
            choices: [
                {
                    name: 'script - A simple TypeScript script. Creates empty project with index.ts as entry point',
                    short: 'script',
                    value: 'script'
                },
                {
                    name: 'server - A server preconfigured to run with PM2',
                    short: 'server',
                    value: 'server'
                }
            ]
        }
    ],
    actions: [
        {
            type: 'addMany',
            destination: '{{ turbo.paths.root }}/apps/{{ app-name }}',
            templateFiles: '../templates/app/common/**/*',
            base: '../templates/app/common',
            globOptions: {
                dot: true
            }
        },
        {
            type: 'addMany',
            destination: '{{ turbo.paths.root }}/apps/{{ app-name }}',
            templateFiles: '../templates/app/{{ app-type }}/**/*',
            base: '../templates/app/{{ app-type }}',
            globOptions: {
                dot: true
            },
            force: true
        },
        {
            type: 'merge-package-json',
            templateFile: './turbo/templates/app/common/package.json',
            packageFile: '{{ turbo.paths.root }}/apps/{{ app-name }}/package.json'
        } as MergePackageJsonConfig,
        {
            type: 'pnpm-install'
        }
    ]
};
