## Deployment

### Tools

Install:

- AWS CLI

### Repo Branches

We use three branches for deployment: `development`, `qa`, `master`.

- `development`: This branch is the target of all PRs and thus contains all approved features. Automatically deployed to `discovery-ui-develpoment` (dev-discovery.nypl.org)
- `qa`: Automatically deployed to `discovery-ui-qa` (qa-discovery.nypl.org)
- `master`: Our "production" branch. Automatically deployed to `discovery-ui-production` (discovery.nypl.org)

If we have a new feature to add, the suggested workflow is:

- Create branch for new feature `git checkout -b new-feature` off the `development` branch.
- Create Pull Request pointing to the `development` branch.
- To test the branch on the development server, follow the instructions below for deploying to Development
- Once the Pull Request is accepted merge it into `development`
- Update version in `development` branch:
  - Decide on appropriate new version number
  - Add notes to CHANGELOG.md & update `package.json` version number. Commit.
  - `git push origin development`
- Eventually merge `development` into `qa`
- Eventually merge `qa` into `master`
- Add git tag to `master` (e.g. `git tag -a v1.4.3; git push --tags`)

### Versioning

Once a feature branch has been approved and merged into development

### Deployment

|                  | Development              | QA               | Production              |
| ---------------- | ------------------------ | ---------------- | ----------------------- |
| Git branch       | development              | qa               | master                  |
| AWS Profile      | nypl-sandbox             | nypl-digital-dev | nypl-digital-dev        |
| Application Name | discovery-ui             | discovery-ui     | discovery-ui            |
| Environment Name | discovery-ui-development | discovery-ui-qa  | discovery-ui-production |
