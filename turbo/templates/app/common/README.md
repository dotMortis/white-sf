# {{app-name}}

## Description

![It's empty](https://media.tenor.com/T20JTqAhNBcAAAAd/travolta-empty.gif)

## Creating a new release

You can create a new version by issuing `pnpm prerelease|prepatch|preminor|premajor` for a staging release or `pnpm livepatch|liveminor|livemajor` for a live release. This will only create a git tag. To actually publish the app you need to create an Azure Pipeline or similar.
