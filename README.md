## Discovery Sandbox

Front-end app for searching, discovering, and placing a hold on research items at NYPL. Using data from the [Discovery API](https://github.com/NYPL-discovery/registry-api).

## Technology

* Universal React
* [Alt](http://alt.js.org/)/Iso as the Flux implementation
* Webpack & Webpack Dev Server
* ES6 and Babel
* ESLint with [Airbnb's config](https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb)
* Unit Testing with [Mocha](https://mochajs.org/) and [Enzyme](http://airbnb.io/enzyme/)
* Express Server

## Installation

To install packages run

    $ npm install

To run locally in development mode run

    $ npm start

and visit `localhost:3001`.

To run locally in production mode run

    $ npm run dist
    $ NODE_ENV=production npm start

and visit `localhost:3001`.

## Testing

### Unit Tests
Unit tests are currently written in the [Mocha](https://mochajs.org/) testing framework. [Chai](http://chaijs.com/) is used as the assertion library and [Enzyme](http://airbnb.io/enzyme/) is used as the React testing utility.

The tests can be found in the `test` folder.

To run all the tests once, run

    $ npm run test

To run the tests continuously for active development, run

    $ npm run test-dev

### Code Coverage
[Istanbul](https://istanbul.js.org/) is used for checking code coverage.

To run the code coverage tool and view a quick report, run

    $ npm run coverage

To run the code coverage tool and view a better report, run

    $ npm run coverage-report

This last command will create a folder called `coverage` in the root directory. You can open up `coverage/lcov-report/index.html` in a browser to see more details about what lines of codes have not been tested.

## Misc

Starting up from a [Node/React boilerplate](https://bitbucket.org/NYPL/dgx-nypl-react-boilerplate).
