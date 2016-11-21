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


Starting up from a [Node/React boilerplate](https://bitbucket.org/NYPL/dgx-nypl-react-boilerplate).
