import { promises as fs } from 'fs';
import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import { argv } from 'process';

const pathsIndex = argv.indexOf('--paths');
const paths = pathsIndex > -1 ? argv[pathsIndex + 1]?.replace(/ +/, ' ').split(' ') : ['./src'];

const isDistOnly = argv.some(a => a === '--distOnly');

const getAllFiles = async dirPath => {
    let arrayOfFiles = [];
    const files = await fs.readdir(dirPath, { withFileTypes: true });
    for (const file of files) {
        if (file.isDirectory()) {
            arrayOfFiles = arrayOfFiles.concat(
                await getAllFiles(path.join(file.parentPath, file.name))
            );
        } else {
            arrayOfFiles.push(path.join(file.parentPath, file.name));
        }
    }
    return arrayOfFiles;
};

const pJsonPath = './package.json';
const pjson = JSON.parse(await readFile(pJsonPath));
pjson.exports = {};
for (const p of paths) {
    const files = await getAllFiles(p);
    files
        .filter(f => f.match(/\.tsx?$/))
        .forEach(b => {
            const name = b.split('/').pop();
            if (name.startsWith('_')) return;
            const shortPath = b
                .split('/')
                .slice(paths.length > 1 ? 0 : 1)
                .join('/');

            const isSrc = b.startsWith('src/');
            const propPathStart = isSrc ? './' : `./${b.split('/').shift()}#`;
            let propName = name.slice(0, name.lastIndexOf('.'));
            let propPath = propPathStart;
            if (propName === 'index') {
                const subProbPath = b.split('/').slice(1).slice(-2, -1).pop();
                console.log({ subProbPath, b });
                propPath = isSrc ? '.' : propPathStart.slice(0, -1);
                if (subProbPath != null) {
                    propPath += `/${subProbPath}`;
                }
            } else {
                propPath += propName;
            }
            console.log(propPath);
            if (propPath in pjson.exports) {
                throw new Error(`Key "${propName}" duplicated in ${b}`);
            }
            const typesPath = './' + b;
            const defaultPath = './dist/' + shortPath.replace(/\.tsx?$/, '.js');
            if (isDistOnly) {
                pjson.exports[propPath] = defaultPath;
            } else {
                pjson.exports[propPath] = {
                    types: typesPath,
                    default: defaultPath
                };
            }
        });
}

pjson.exports['./package.json'] = './package.json';

await writeFile(pJsonPath, JSON.stringify(pjson, undefined, 4) + '\n');
