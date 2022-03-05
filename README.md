## Ticker Tick Common modules


## How to publish new versions
 - ok, so, merge all PRs
 - git pull all latest code
 - go to the library directory, for example, `packages/helpers`, run `npm version <patch | minor | major>` and then git commit
 - run `npm publish` to publish new version to NPM registry
 - go to the application project, for example, ticker-tick-web, just update the library version.

## How to debug
 - go to the library directory, for example, `packages/helpers`, run `npm link`
 - go to the application project root director, run `npm link @tickertick/helpers`
 - if you are done debugging, run `npm unlink` and `npm unlink @tickertick/helpers` respectively
 - don't forget to go to the application project root directory again, run `npm install`