## Deployment

### Tools
Install:
* AWS CLI
* EB CLI

### Repo Branches
We will deploy three branches: `dev-eb-deploy`, `qa`, `master`.

- `master` will always be deployed to production discovery.nypl.org
- `qa` will always be deployed to qa qa-discovery.nypl.org
- `dev-eb-deploy` will be deployed to development dev-discovery.nypl.org

If we have a new feature to add, the suggested workflow is:
- Create branch for new feature `git checkout -b new-feature` off the `development` branch.
- Create Pull Request pointing to the `development` branch.
- To test the branch on the development server, merge your feature branch to `dev-eb-deploy`
-- `git checkout dev-eb-deploy`
-- `git merge --no-ff new-feature`
- Deploy to dev (see instructions under 'Deployment' below)
- Once the Pull Request is accepted and merged into `development`, the `development` branch should be
merged to `qa` and then `qa` should be merged to the `master` branch when ready.

The following documentation is for after your code has been merged into `dev-eb-deploy`, `qa`, or `master`.

### Why three branches?
Currently, all our development and new features are going into the development branch. As of our
Internal Beta release, we are introducing a QA environment for NYPL staff training and preview, and for
QA testing. The master branch will be our production branch for live releases to the public.

### Elastic Beanstalk
There are two existing AWS accounts that we are deploying to for development and for qa/production.

Make sure you have the AWS CLI tool installed on your machine and make sure you have the correct credentials for the two accounts. Since we have two accounts, nypl-sandbox and nypl-digital-dev, make sure you create two profiles using the AWS CLI tool:

    aws configure --profile nypl-digital-dev

Pass in the correct credentials and now we can start deploying.

### Configuration
Run `eb init` at the root of this repo with the following settings:
 - Select region 'us-east-1'
 - Select application 'Discovery'
 - Select default environment 'discovery-ui-dev'
 - If asked about CodeCommit, select 'n'
 - If asked if you want to set up SSH for your instances, select 'n'
 - Now manually edit `.elasticbeanstalk/config.yml` to include the following `branch-defaults`:
```
branch-defaults:
  dev-eb-deploy:
    environment: discovery-ui-dev
    group_suffix: null
  master:
    environment: discovery-ui
    group_suffix: null
  qa:
    environment: discovery-ui-qa
    group_suffix: null
```

Right now, the production AWS account (nypl-digital-dev) has an SSL certification which is committed to the repo in `.ebextensions/01_loadbalancer-terminatehttps.config`. This will fail to upload to the development AWS account since they are both two different accounts. To remedy this, the `dev-eb-deploy` branch does not have that file committed and it can be used to deploy to the development account (which does not have the SSL certificate).

### Deployment
The `.elasticbeanstalk/config.yml` file needs to be updated before deploying. If deploying to the development account, the `application_name` needs to change to `discovery`, and if deploying to the production account, the `application_name` needs to change to `discovery-ui`.

|                  | Development      | QA              | Production   |
| ---              | ---              | ---             | ---          |
| Application Name | discovery        | discovery-ui    | discovery-ui |
| Environment Name | discovery-ui-dev | discovery-ui-qa | discovery-ui |

----
Deploy to the dev server:

- Merge feature branches to `dev-eb-deploy`
- Update `global.application_name` in `.elasticbeanstalk/config.yml`:
```
global:
  application_name: Discovery
```
- Run `eb deploy discovery-ui-dev --profile nypl-sandbox`

----
Deploy to the qa server:

- Merge working and approved changes up to `qa`
- Update `global.application_name` in `.elasticbeanstalk/config.yml`:
```
global:
  application_name: discovery-ui
```
- Run `eb deploy discovery-ui-qa --profile nypl-digital-dev`

----
Deploy to the production server:

- Merge working and approved changes up to `master`
- Update `global.application_name` in `.elasticbeanstalk/config.yml`:
```
global:
  application_name: discovery-ui
```
- Run `eb deploy discovery-ui-production --profile nypl-digital-dev`

### Troubleshooting

#### Python error: "ERROR: TypeError :: cannot concatenate 'str' and 'NoneType' objects"

This may indicate your `.elasticbeanstalk/config.yml` is missing a value or two. Try running `eb init` to fill in missing values. See "Configuration" section above for best defaults.
