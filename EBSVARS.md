# Table of Contents

- [General Information](#general-information)
- [Server and Application-wide Variables](#server-and-application-wide-variables)
- [Application Variables](#application-variables)
- [Testing](#testing)
- [AWS Elastic Beanstalk Environment Variables](#aws-elastic-beanstalk-environment-variables)

## General Information

Environment variables are used in this code repository to control how the application builds, how and where data is fetched for separate sections in the application, for rendering certain features, and for controlling data flow.

General environment variables are declared in the `.env-sample` file. A copy of this file should be made and saved as `.env` where real values should be added. In the application, the `.env` file is read and all variables are loaded in the main `index.js` file.

Generally, environment variables are meant to be read through the `process.env` object _on the server_. In order to pass these variables to the client where some of these variables are used, Webpack is used to define and bundle certain variables. This is done through the `DefinePlugin` Webpack plugin found in the `webpack.config.js` file. Most of these variables are used in `src/app/data/appConfig.js` for application-wide configuration.

If an environment variable is updated, make sure to restart the server for the application to pick up the new value.

## Server and Application-wide Variables

These variables are used to configure server settings and application-wide settings.

| Variable | Type | Value Example | Description |
| -------- | ---- | ------------- | ----------- |
| `APP_ENV` | string | `production`, `development` | The environment variable checked in the NYPL Header, but also used in the `DrbbContainer` component.
| `BASE_URL` | string | `/research/research-catalog` | The base URL for the application. |
| `BUNDLE_ANALYZER` | boolean | true, false | Whether or not to run the `webpack-visualizer-plugin` plugin in webpack. |
| `DISPLAY_TITLE` | string | "Research Catalog" | The title of the application displayed throughout the UI. |
| `GA_ENV` | string | `development`, `production` | Used to decide what Google Analytics code should be used. |
| `LEGACY_BASE_URL` | string | "" | The base url for the legacy catalog. |
| `NODE_ENV` | string | `development`, `test`, `production` | The environment in which the application is running. When running `npm test`, the value is `test`. When running locally, the default is `development` but it should be `production` for the "production" build and server. |
| `REDIRECT_FROM_BASE_URL` | string | "/research/collections/shared-collection-catalog" | The old base URL of the app. If a user goes to the old URL, the server redirects the user. |
| `WEBPAC_BASE_URL` | string | "" | The base URL for the webpac catalog. |

## Application Variables

These environment variables control how certain elements on the page render and where to fetch data.

| Variable | Type | Value Example | Description |
| -------- | ---- | ------------- | ----------- |
| `CIRCULATING_CATALOG` | string | "" | The URL of the NYPL circulating catalog. |
| `CLOSED_LOCATIONS` | string | "all; Library of the Performing Arts" | A semicolon-delimited list of strings. Include quotes around the string. All locations beginning with any string in this list will be removed from the list of request options in the `ElectronicDelivery`, `HoldRequest`, and `ItemTableRow` components. Currently used physical locations: `Schwarzman;Science;Library for the Performing Arts;Schomburg`. To close all locations, add `all`. This will also remove EDD as a request option, the 'Request' buttons, and also disable the hold request/edd forms. If `all` is not present, EDD and 'Request' buttons will still be available. |
| `DRB_API_BASE_URL` | string | "" | The base URL for the DRB API. |
| `FEATURES` | string | "first-feature,second-feature,yet-another-feature" | A comma-delimited list of features that should be turned on in the application. Specifying `no-onsite-edd` as a feature will ensure that the discovery api returns all onsite items as eddRequestable: false. Specifying `parallels` as a feature will enable interleaving of Bib fields with parallel fields. |
| `GENERAL_RESEARCH_EMAIL` | string | "email@email.com" | Not currently used in the app. |
| `HOLD_REQUEST_NOTIFICATION` | string | "A notification on a hold request page." | This can be any string, including html, which will be added as a notification on the `HoldRequest` landing page and the EDD page. |
| `ITEM_BATCH_SIZE` | number | 100 | The number of items to fetch in a single request for a bib. |
| `LIB_ANSWERS_EMAIL` | string | "email@email.com" | The email used in the `Feedback` component for the destination field. |
| `loada11y` | boolean | true, false | Used to turn on the `react-a11y` package for accessibility testing. Only use in development mode. |
| `LOGIN_URL` | string | "" | The URL to log a user into the NYPL Catalog. The user will be redirected to sign in with their NYPL credentials. This controls whether the "My Account" link in the banner subnavigation displays or is hidden. |
| `NON_RECAP_CLOSED_LOCATIONS` | string | "" | The list of closed locations that are not recap. |
| `OPEN_LOCATIONS` |  string | "Library of the Performing Arts" | A comma-delimited list of locations. If set to anything other than an empty string, only locations matching one of these strings will be displayed. |
| `RECAP_CLOSED_LOCATIONS` | string | "" | The list of closed locations that are recap. |
| `SEARCH_RESULTS_NOTIFICATION` | string | "A notification on the search results page." | This can be any string, including html, which will be added as a notification on the `SearchResults` page. |
| `SHEP_API` | string | "" | The base URL for the Subject Heading Explorer API. |
| `SHEP_BIBS_LIMIT` | string | 25 | The number of bibs to fetch from the SHEP API. |
| `SOURCE_EMAIL` | string | "email@email.com" | The email used in the `Feedback` component for the source field. |

## Testing

When tests are run through the `npm test` command, the setup configuration file at `/test/helpers/browser.js` reads environment variables from the `test.env` file.

## AWS Elastic Beanstalk Environment Variables

As previously mentioned in the [README](README.md), we are using environment variables to make authorized requests to NYPL's API platform. In order to be secure, we are encrypting and decrypting those environment variables using AWS KMS. Please get these variables from someone in the NYPL Digital Department.

| Variable | Description |
| -------- | ----------- |
| `KMS_ENV` | Determines whether to interpret ..CLIENT_ID and ..CLIENT_SECRET variables as "encrypted" or "unencrypted". Default "encrypted". | 
| `PLATFORM_API_CLIENT_ID` | Platform client id. If KMS_ENV is "encrypted", this value must be encrypted. |
| `PLATFORM_API_CLIENT_SECRET` | Platform client secret. If KMS_ENV is "encrypted", this value must be encrypted. |
| `PLATFORM_API_BASE_URL` | Platform api base url (e.g. "http://example.com/api/v0.1") |

### Encrypting

Two variables are assumed encrypted when `KMS_ENV` is "encrypted": `PLATFORM_API_CLIENT_ID` and `PLATFORM_API_CLIENT_SECRET`. We need these variables to create an instance of the `nypl-data-api-client` npm package and make authorized requests to the NYPL Digital API endpoints. This is needed for the Discovery UI app to make requests itself to the APIs.

In order to encrypt, please use the `aws` [cli tool](https://aws.amazon.com/cli/). The command to encrypt is

    aws kms encrypt --key-id [your IAM key from AWS] --plaintext [value to encrypt] --output text --query CiphertextBlob

The `aws kms encrypt` commands returns and object with a `CiphertextBlob` property. Since we only want that value, we use the `--query` flag to retrieve just that. This value can be copied and pasted into the AWS EBS configuration in the UI for the app's environment.

More information can be found in the [encrypt docs](http://docs.aws.amazon.com/cli/latest/reference/kms/encrypt.html).

NOTE: This value is base64 encoded, so when decoding make sure to decode using base64.

### Decrypting

In order to decrypt, we are using the `aws-sdk` npm module. Please check the [nyplApiClient](src/server/routes/nyplApiClient/index.js) file for more information and implementation on decryption.
