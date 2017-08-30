## CHANGE LOG

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
