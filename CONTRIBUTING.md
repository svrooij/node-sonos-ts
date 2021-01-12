# Contributing Guide

Contributing to `node-sonos-ts` is fairly easy. This document shows you how to
get the project, run all provided tests.

## Dependencies

To make sure that the following instructions work, please install the following dependencies
on you machine:

- Node.js (comes with a bundles npm)
- Git

## Fork library

You should start by creating a [fork](https://github.com/svrooij/node-sonos-ts/fork). And create a new branch of the **beta** branch, all pull requests should be against the beta branch.

### Install Pull application (optional)

We like to use the Github [pull](https://github.com/apps/pull) application, to keep our beta branch and the forks up-to-date. You have to install this application yourself, but it will work automatically.

## Install node dependencies

After taking the latest version your should install the latest dependencies.

Run `npm install`

## Building

Building the library is easy `npm run build`, this file **compile** the TypeScript code to a javascript library.

## Testing

We depend on **ESLint** to keep our code nicely, and we try to write tests for all manually added code.

To run all the tests, run `npm run test`

### Source linting: `npm run lint`

`npm run lint` performs a lint for all, also part of `test`.

Most errors (like missing `;`) can be fixed by running `npm run lint-fix`.

### Unit testing: `npm run jest`

`npm run jest` executes (as you might think) the unit tests, which are located in `tests`.
Also part of `npm run test`.

The used test framework is jest, you can also use [Jest test explorer for VSCode](https://marketplace.visualstudio.com/items?itemName=kavod-io.vscode-jest-test-adapter) to easily browse and debug all separate tests.

## Contributing/Submitting changes

- Check out a new branch based on `beta` and name it to what you intend to do:
  - Example: `git checkout -b BRANCH_NAME origin/beta`
    If you get an error, you may need to fetch canary first by using `git remote update && git fetch`
  - Use one branch per fix/feature
- Make your changes
  - Make sure to also add tests for your addition.
  - Run your tests with the provided vscode launch, the test explorer or the command line.
  - Run code linting (of just auto lint `npm run lint-fix`)
  - When all tests pass, everything's fine.
- Commit your changes
  - Please provide a git message that explains what you've done.
    Your commit message should start with `fix:` for bug fixes or with `feat:` for new features. Please discuss in issue if you think it's a new feature.
    Also use closing keywords in the commit, like `Fixed #xx` to auto-close some issues.
  - Commit to the forked repository.
- Make a pull request
  - Make sure you send the PR to the `beta` branch.
  - Github Actions are watching you!

If you follow these instructions, your PR will land pretty safely in the main repo!
