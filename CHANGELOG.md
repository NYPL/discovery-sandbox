## CHANGE LOG

### 0.7.0 - QA v1
- This was the first of two sprints before we go from Internal Beta to Public Beta. YAY!  :rocket: :books:
- A lot of accessibility, QA, and feedback fixes were completed this sprint.
  - Each page was checked through a11y tools.
  - Page titles, duplicate IDs, color contrast, valid HTML, and other fixes were completed.
- The EDD form went through another iteration with updated content, input validation, and error checking.
  - This includes listing the errors and making them links to the input fields.
- Also not allowing to place a request if EDD is not available or if there are no delivery locations.
- Adding badges to the README to better know the status of our repo.
  - Moving the version syntax to 0.7.0 without the `v` in the front.

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
