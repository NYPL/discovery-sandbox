## CHANGE LOG

### 1.6.1
- Subject heading "explosion": Subject headings on bib pages contain multiple hierarchical filtered search links.
- Updating @nypl/dgx-header-component to 2.5.6

### 1.6.0
- Updating to add more checks to see if the bib detail fields include subject headings. If so, it will then call the additional string methods to generate new texts and URLs for the link.

### 1.5.9
- Updating the filters to include subject literal as a possible filter type
- Fix bugs relating to browser navigation

### 1.5.8
- Updating @nypl/dgx-react-footer to 0.5.2.

### 1.5.7
- Updating @nypl/dgx-header-component to 2.4.19.

### 1.5.6
- Updating @nypl/dgx-header-component to 2.4.15 and checking for QA in APP_ENV.

### 1.5.5
- Updating @nypl/dgx-header-component to 2.4.14 and setting APP_ENV.

### 1.5.4
- Updating @nypl/dgx-header-component to 2.4.13.

### 1.5.3
- Updating @nypl/dgx-header-component to 2.4.12.

### 1.5.2
- Updating the instructions for EDD form.

### 1.5.1
- Updating the Header component to v2.4.11 and the Footer component to v0.5.1.
- Remove `componentDidMount` from `BibPage` component to fix log in and seeing Delivery Locations issues.

### 1.5.0
- Adds Tab interface for details and additional details together with attendant css and changes to BibPage and AdditionalDetailsViewer
- Fix dependency vulnerabilities, most via minor upgrades.
- Fix two bugs related to paging through search results (https://jira.nypl.org/browse/SCC-940 , https://jira.nypl.org/browse/SCC-939 )

### 1.4.3
- Documentation: Revised DEPLOYMENT.md to remove dev-eb-deploy, simplify strategy
- Added deploy-* scripts to package.json

### 1.4.2
- Updating @nypl/dgx-react-footer version to 0.5.0 and @nypl/dgx-header-component to 2.4.8.

### 1.4.1
- Change how Notes are rendred: Render notes grouped by noteType, with noteType shown at root level of hierarchy.
- Add support for rendering Contents (tableOfContents)

### 1.4.0
- Adding OptinMonster script and updating header to 2.4.7.
- Updating Travis CI configuration for CD to AWS Elastic Beanstalk.

### 1.3.1
- Removing hold request notification due to inclement weather (again).

### 1.3.0
## ReCAP 1.2 Release
The main goal for this release was to add more delivery locations options for Hold Requests, to get more fields exposed for bib information in the UI, and to release a dropdown form for selecting filters for searching.
- The Design Toolkit was updated and that include layout and style updates on the Search Results page, Hold Request page, and Electronic Document Delivery page.
- The omnisearch on the Search Results page has a new mobile design for better usability.
- Accessibility updates were added throughout the page. This included minor heading and label changes, but also big ones for better screenreader usability.
- New bib fields were rendered on the Bib Page, including `Publication` (update to `publicationStatement`), `Publication Date`, `Uniform Title`, `Alternative Title`, `Genre/Form`, `Contents` (updated notes). Some field attributes have not change but more data is being rendered since updates were made in the metadata and API side.
- This was the second attempt at releasing Filters. Since the first iteration months ago, bugs were fixed, components refactored, and the design was changed. Many of the existing CSS DOM and class names have not changed from "modal"/"popup" to "dropdown" but we're working on updating both this repo and the Design Toolkit (where the class names come from). Users can select filter options from the Format, Date, and Language categories, remove them one by one or all at once, and adjust existing selections.
- The biggest hurdle in this deployment was the accessibility update necessary to make the filter and search work for screenreaders. Multiple combinations of `aria-live` and javascript focus scripts were used. It's not perfect but we're at a good stable place where, after searching or applying any number of filters, the screen reader announces that the page is 1) loading, 2) that they are currently on an h2 heading, and 3) how many search results have returned.
- Deploying with 78% code coverage.

### 1.2.10
- Small hold request content notification for inclement weather.

### 1.2.9
- Deploying logic check to make sure that an item really is available before placing a hold request on it. Mostly for the situation where a patron comes from the catalog.

### 1.2.8
- Update to Header component v2.4.5.

### 1.2.7
- Removing notifications from Hold Request page.

### 1.2.6
- Update to Header component v2.4.3 (small hotfix) and update to Notification on Hold Request Page.

### 1.2.5
- Update to Header component v2.4.2 and ejs package update.

### 1.2.4
- Update the Header and Footer npm components to v2.4.1 and v0.4.1, respectively.

### 1.2.3
- Updated Notification on Hold Request component in support of hours of operation changes for January 2018.

### 1.2.2
- Added Notification on Hold Request component for 2017 holiday closings.

### 1.2.1
- Update Header component version to 2.4.0.

### 1.2.0
- Update dgx-react-ga related functions for Header Component and dgx-react-ga updates.

### 1.1.7
- New version of the header just in time for the Fundraising Banner! :unamused:

### 1.1.6
- Update the header to version v2.1.1.

### 1.1.5
- Hotfix to remove the MARC link on bib detail page as the link to Webpack is not working.

### 1.1.4
- Hotfix to display the publisher field which went from `publisher` to `publisherLiteral` in the Search Results.

### 1.1.3
- Hotfix to display the publisher field which went from `publisher` to `publisherLiteral`.

### 1.1.2
- Small updates:
- Update the display text for electronic resources to use `label` instead of `prefLabel`.
- Added better error messages with more information to check in Cloudwatch.
- Added a few more tests to the util functions.

### 1.1.1
- Added Google Analytics events throughout the app.
- Added new Google Form for the feedback widget and refactored it so it's always rendered on the page. Otherwise, the dynamic rendering of the form caused it to not submit any new submissions.
- New Design-Toolkit upgrade.

### 1.1.0
- Added more unit tests for React Components.
- Added a11y updates to the animation layer and the feedback widget by adding a focus trap when they are opened.
- Cleaned up CSS and JS.
- Capitalization update on some headings.
- Fix to the updated supplementary content property from the API.

### 1.0.0
- :rocket:!
- First release of Discovery/Shared Collection Catalog.
- Updated the accessibility for the loading layer animation screen including aria labels and better
focus.
- Updated the DOM structure of the EDD form page.
- Updated npm package versions.
- Updated the accessibility for the feedback form, removing required attributed for aria-required
and adding a Cancel button.
- Updated the Google Analytics ID.
- Updated the Hold Confirmation copy.

### 0.8.2
- Small pre-launch update.
- Added tests for more components.
- Added a 'partOf' field for a bib.
- Fixed a server issue where the bib did not exist. Now it redirects to the 404 page.
- Fixed a bug where links did not go back to a search for that linked value.
- Displaying electronic resources on the bib page.
- Updating logic for 'Publication' information that broke a few pages.

### 0.8.1 - Cache hotfix
- Removed caching from API calls from the nypl-data-api-client module.

### 0.8.0 - QA v2
- The second sprint before we public launch. This released focused on NYPL's Production Readiness standards and fixing a11y issues.
- OAuth credentials and AWS KMS keys were better handled and configured in Elastic Beanstalk for our development, qa, and production instances.
- The header structure on each page was updated.
- A 404 page was introduced.
- Copy changes were made in the Hold Confirmation page, the Search Results page, and the omnisearch placeholder.
- The bib record page was restructured to include two definition lists and the MARC record is outside those lists now. Supplementary Content is now displayed if available.
- Logic for requestability and non-ReCAP NYPL items were improved.
- Configurations were made to set up the UI for development and production API platforms.
- Logging and an alarm in AWS Cloudwatch was set up.
- The confirmation page can now link back to the Classic Catalog if that's where the patron came from.
- Other general accessibility updates were made in the omnisearch, breadcrumbs, and hold confirmation page.

### 0.7.0 - QA v1
- This was the first of two sprints before we go from Internal Beta to Public Beta. YAY!  :rocket: :books:
- A lot of accessibility, QA, and feedback fixes were completed this sprint.
  - Each page was checked through a11y tools.
  - Page titles, duplicate IDs, color contrast, valid HTML, and other fixes were completed.
  - The complete hold request for physical and EDD workflow works without Javascript enabled.
- The EDD form went through another iteration with updated content, input validation, and error checking.
  - This includes listing the errors and making them links to the input fields.
- Also not allowing to place a request if EDD is not available or if there are no delivery locations.
- Adding badges to the README to better know the status of our repo.
  - Moving the version syntax to 0.7.0 without the `v` in the front.
- The default option for a Hold Request is now the first option, which is usually EDD.
- There's a link on the Hold Confirmation page that leads back to the Search Results page, only if you got to that page from making a search.
- Better error handling for the Hold Request page when the API is down, or there are no delivery locations.
- Context for search results when clicking on a link from the Catalog Record (bib) page. E.g. `100 results for author Shakespeare`.

### v0.6.0 - Internal Beta Release
- Better workflow for placing a hold on physical items.
- Electronic Delivery is now working.
- Updated homepage, app name, and app styling.
- Updated fields to display on a Catalog Record page.
- Accessibility updates.
- Removed filters for this release.
- Updated to the Design-Toolkit included.
- Big update to include reverse proxy integration on NYPL site.
- More smaller updates to make it all come together!

### v0.5.0 - New Design v1
- v2 of the bib page which added pagination for items but still includes the no-js fallback.
- A lot more no-js fallbacks.
- Bigger refactor of components.
- v1 of the second iteration from the Design Toolkit - new design - for the bib page.
- Added back item detail in search results but only if each bib has one item.
- Added more static mockups for the Hold Request page - multiple delivery location.
- Added Travis for better test workflow when we commit code.

### v0.4.0 - Hold Request
- This update includes the Hold Request workflow which was decided to be brought back in. From the bib page, you can click on the "Request" button to place a Hold Request.
- Fixed a lot of bugs regarding functionality for searching and filtering.
- Refactored components and added a few tests.
- v1 of the bib page which includes no-js fallback.

### v0.3.0 - Design Toolkit Beta
- Next biggest update that uses the NYPL Design Toolkit for the search results and bib page.

### v0.2.0
- Upgrading to React v15.
