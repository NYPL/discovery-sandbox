## Discovery

### Version

> 1.7.1

### Research Catalog (formerly Shared Collection Catalog)

[![GitHub version](https://badge.fury.io/gh/nypl-discovery%2Fdiscovery-front-end.svg)](https://badge.fury.io/gh/nypl-discovery%2Fdiscovery-front-end)
[![Build Status](https://travis-ci.org/NYPL/discovery-front-end.svg?branch=master)](https://travis-ci.org/NYPL/discovery-front-end)
[![Dependencies Status](https://david-dm.org/nypl-discovery/discovery-front-end/status.svg)](https://david-dm.org/nypl-discovery/discovery-front-end)
[![devDependencies Status](https://david-dm.org/nypl-discovery/discovery-front-end/dev-status.svg)](https://david-dm.org/nypl-discovery/discovery-front-end?type=dev)

[![forthebadge](http://forthebadge.com/images/badges/built-with-love.svg)](https://nypl.org)

Front-end app for searching, discovering, and placing a hold on research items from NYPL and ReCAP partners. Currently using data from the [Discovery API](https://github.com/NYPL-discovery/registry-api).

## Technology

- Universal React
- Redux
- Webpack & Webpack Dev Server
- ES6 and Babel
- ESLint with [Airbnb's config](https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb)
- Unit Testing with [Mocha](https://mochajs.org/) and [Enzyme](http://airbnb.io/enzyme/)
- Express Server
- [Travis](https://travis-ci.org/)
- [Prettier](https://prettier.io/docs/en/index.html)

## Installation and Development

### Node Runtime

```
Version 10.17.0
```

Best practices (though not requried) would suggest using a Node Version Manger (nvm) to aid in managing which Node runtime to use for development. Through utilizing an nvm you've the ability to quickly migration to and fro between different version for base development and/or testing purposes. Depending on your OS (\*Nix vs Windows) installation of a nvm varies.

Related packages can be found here:

- [NVM for Windows](https://github.com/coreybutler/nvm-windows)

- [NVM for Mac](https://github.com/nvm-sh/nvm)

### Installation

To install packages run

```
$ npm install
```

#### Note

When installing you'll notice a pre and post install script run. These scripts are for **_QA_**/**_Production_**/**_Staging_** environments and can be ignored. However, if the scripts fail you it may indicate you're running a different version of Node's runtime environment.

### Configuration

See `.env-sample` for supported environmental variables. Rename `.env-sample` to `.env` and replace placeholder values with your own - or obtain a prefilled version from a coworker.

See [EBSVARS](EBSVARS.md) for more information.

### Development mode with different API environments

To run a local instance of the Discovery Front End application using configurations from `.env`:

```
npm run start
```

As a convenience, the following commands override some config for you:

- `npm run dev-api-start`: Use development API with *un*encrypted creds from `.env`
- `npm run prod-api-start`: Use production API with encrypted creds from `.env`

Visit `localhost:3001` to see the UI locally.

### Note: Legacy Development Mode

If you choose to keep your environment file with each variable as `export set [key]=[value]`
you must start the application with `source .env; npm run start`
This approach to setting environment variables is specific to all Nix Operating Systems.

### API Responses

There is a sample of the API responses that we receive from Platform in `sampleApiResponseStructure.json`. It is abbreviated but shows how we receive filters and search results. This is the response from the api endpoint, which the app sends requests to
whenever it requires new search results (for example when a new search is entered from the home page or when a subject link is followed from a Bib show page).

### Production mode

By default, the app runs with `NODE_ENV=development`, which means a separate server is invoked to serve live updates to assets in development. Deployed instances of the app operate with `NODE_ENV=production`, indicating the app should serve pre-built assets. Sometimes it's useful to run the app in production mode locally (e.g. to test the app for NOSCRIPT visitors).

To run the app locally in production mode you need to run two commands:

- `npm run dist`: This builds the assets.
- `source .env; npm run prod-start`: Start servers using production API & serve prebundled assets.

Visit `localhost:3001` to see the UI locally.

## Contributing

This app has an unusual Git Workflow / deployment scheme:

- Cut feature branches off of the `development` branch
- Tag your feature branch\* `qa-deployment-{YYYY}-{MM}-{DD}` to deploy to QA
- Merge your feature branch into `production` to deploy to production

\* To QA multiple feature branches, create a branch called `qa-release-{YYYY}-{MM}-{DD}`, merge your feature branches into that, and then tag that with `qa-deployment-...`

## Webpack Bundle Analyzer

We're using the [webpack-bundle-analyzer](https://github.com/th0r/webpack-bundle-analyzer) to analyze what is making the bundle file so big. When starting the app locally, or when running `npm run dist`, a `report.html` file will be generated in `/dist`. View this file in the browser to see the results from `webpack-bundle-analyzer`.

## Testing

### Unit Tests

Unit tests are currently written in the [Mocha](https://mochajs.org/) testing framework. [Chai](http://chaijs.com/) is used as the assertion library and [Enzyme](http://airbnb.io/enzyme/) is used as the React testing utility.

We are also integrating [Travis](https://travis-ci.org/) for better test work flow. After every push to the github repo, Travis will help us build and test the code.

You can see the current build result at [here](https://travis-ci.org/NYPL/discovery-front-end).

The tests can be found in the `test` folder.

To run all the tests once, run

    $ npm run test

To run the tests continuously for active development, run

    $ npm run test-dev

To run a specific test file, run

    $ npm run test-file test/unit/SearchResultsPage.test.js

### Code Coverage

[Istanbul](https://istanbul.js.org/) is used for checking code coverage.

To run the code coverage tool and view a quick report, run

    $ npm run coverage

To run the code coverage tool and view a better report, run

    $ npm run coverage-report

This last command will create a folder called `coverage` in the root directory. You can open up `coverage/lcov-report/index.html` in a browser to see more details about what lines of codes have not been tested.

### End-to-end Tests

Currently testing out [Nightwatch.js](http://nightwatchjs.org/) as the testing framework. WebDriver and its API is used by Nightwatch to run end-to-end tests against a browser. WebDriver is a W3C specification aiming to standardize browser automation and that project started off as a part of the Selenium project.

In order to run the tests, the command will be:

    $ npm run nightwatch

but what first needs to be configured are the browser drivers and the Selenium Server.

- Create a folder `bin` at the root level.
- Download the [Selenium Server](http://selenium-release.storage.googleapis.com/index.html) picking the 3.x.x version. Add the `selenium-server-standalone-3.x.x.jar` file inside the `bin` folder.
- Download the latest [Chrome Driver](https://sites.google.com/a/chromium.org/chromedriver/downloads) and add it to the `bin` folder.
- Download the latest [Gecko Driver](https://github.com/mozilla/geckodriver/releases) (for FireFox) and add it to the `bin` folder.

Running `npm run nightwatch` should run the tests now which are located at `test/nightwatch/*`. Currently, starting the Selenium Server, selecting a browser, and running the tests are all encapsulated within the `npm run nightwatch` command.

The command

    $ npm run nightwatch

runs with Chrome as the default browser. If the Firefox browser wants to be tested, run

    $ npm run nightwatch -- --env firefox.

The `default`, `firefox`, and other nightwatch settings can be found in `./nightwatch.json`.

If you run into a Java version issue such as `java.lang.UnsupportedClassVersionError` when running the Selenium server, make sure that your current Java installation is being pointed to in `~/.bash_profile`:

    export JAVA_HOME="/Library/Java/.../Contents/Home/";

## React Accessibility

### eslint-plugin-jsx-a11y

Adding accessibility rule checker through ESLint and the [eslint-plugin-jsx-a11y](https://github.com/evcohen/eslint-plugin-jsx-a11y) plugin. This checks accessibility issues when ESLint is ran in the command line.

Note: At the moment, use ESLint as the global package by install the packages:

    $ sudo npm install -g eslint eslint-plugin-jsx-a11y eslint-config-airbnb

And to check files run:

    $ eslint src/app/components/.../path/to/file.jsx

Or all components at once:

    $ eslint src/app/components/**/*

### react-a11y

[react-a11y](https://github.com/reactjs/react-a11y) is an npm package that can be run in development mode when the `loadA11y` environment variable is set to true.

    $ loadA11y=true npm start

This will output warnings in the browser's console for elements that do not meet accessibility standards. Some rules may be too strict and should be verified against other accessibility rules.

## Misc

Starting up from a [Node/React boilerplate](https://bitbucket.org/NYPL/dgx-nypl-react-boilerplate).

## Deployment

We have CI/CD configured through travis for the following branches:

- `development` deploying to `discovery-ui-development`
- `qa` deploying to `DiscoveryUi-10-17-qa`
- `production` deploying to `DiscoveryUi-production`
- `on-site-edd-development` to `DiscoveryUi-edd-training`

### Elastic Beanstalk

We are using AWS EB to deploy our app. Check the [deployment file](DEPLOYMENT.md) for more information.

## Feedback Form

The `Feedback` component in `src/app/components/Feedback/Feedback.jsx` can help us collect the feedback from patrons, send it to the Google Form, and finally, present it with [the Google Spreadsheet](https://docs.google.com/spreadsheets/d/1jD8EnC0uoPuo118jUF3of9MNgvrXTv1Jww67ZVJCSHs/edit#gid=536144761).

Every time the `Feedback` component has significant updates, it might lead to the need to create a new Google Form and Spreadsheet to match those updates. Here are the steps to create and sync the HTML form with a Google Form.

- First, create a Google Form based on the fields of the HTML form. The fields need to be the same type respectively.

- Second, under the `RESPONSES` tab, click the three dots icon to open the setting, then click `Select response destination`, choose `Create a new spreadsheet`. The spreadsheet will be the one to present the feedback.

- Then, go to the Google Form page and get the form URL.

- Forth, copy the URL, replace the path _/viewform_ with the path _/formResponse_ in its end. Enter the URL to the HTML form's action attribute.

- At last, view the page source of the Google Form page and find the value of each field's name attribute. Enter the value to the name attribute of the respectively field in the HTML form.

- Run the application and test it with the feedback form.

## Alarm and Monitoring with AWS CloudWatch

As one of the NYPL's services, we want to monitor its condition and receive necessary alarms if an error occurs. We set up the alarms and error filters on NYPL's [AWS CloudWatch](https://aws.amazon.com/cloudwatch/). For more details about setting up alarms and log metrics, please see NYPL engineering-general repo's [Monitoring & Alarms Instruction](https://github.com/NYPL/engineering-general/blob/master/standards/alerting.md).

## Adding Locations

When new Sierra locations (especially Sierra locations that are "delivery locations") are added to [NYPL-Core](https://github.com/NYPL/nypl-core), those locations will need to be added to this app. The complete set of steps for adding a location [is a documented LSP Workflow](https://github.com/NYPL/lsp_workflows/blob/5242526be2ad483c3945b94c3660f523bfdbc6bb/workflows/add_scsb_location.md#add-entries-to-nypl-core).

In this repo, two local JSONs are critical to adding locations:

- `./locations.js`: A JSON mapping major hub names (e.g. "schwarzman", "sibl") to data about them (e.g. "full-name", "address")
- `./data/locationCodes.js`: A JSON mapping _all_ sierra location codes to their `delivery_location` and relevant hub name (referencing the keys in `./locations.js`) (Note that sierra locations that act only as _delivery locations_ must be entered in this hash and cite themselves as `delivery_location`.)

These files must be kept up to date with newly added locations to ensure that the hold-request page presents delivery locations with correct labels and building addresses. For example, when Scholar rooms 217 and 223 were added to SASB, entries like the following needed to be added to `./locationCodes.js`:

```
  "mal17": {
    "delivery_location": "mal17",
    "location": "schwarzman"
  },
```

Less frequently, when an NYPL location address changes, we should change the corresponding entry in `./locations.js`.

## Business Continuity

There are variables available in .env to configure the requestable locations.

`CLOSED_LOCATIONS` is a semicolon-delimited list of strings. Include quotes around the string. All locations beginning with any string in this list will be removed from the list of request options. `.env-sample` contains an example of this.

Currently used physical locations: Schwarzman;Science;Library for the Performing Arts;Schomburg

To close all locations, add `all`. This will also remove EDD as a request option, and the 'Request' buttons, and also disable the hold request/edd forms. If `all` is not present, EDD and 'Request' buttons will still be available.

`OPEN_LOCATIONS` is a comma-delimited list of strings. If set to anything other than an empty string, only locations matching one of these strings will be displayed.

`HOLD_REQUEST_NOTIFICATION`: This can be any string, not including html, which will be added as a notification to the HoldRequest landing page, and the EDD page.

`SEARCH_RESULTS_NOTIFICATION`: Same as above, but will be added on the SearchResults page
