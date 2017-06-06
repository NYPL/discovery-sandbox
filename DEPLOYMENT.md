## Deployment

### Tools
Install:
* AWS CLI
* EB CLI

### Elastic Beanstalk
There are two existing AWS accounts that we are deploying to for development and for production.

Make sure you have the AWS CLI tool installed on your machine and make sure you have the correct credentials for the two accounts. Since we have two accounts, nypl-sandbox and nypl-digital-dev, make sure you create two profiles using the AWS CLI tool:

    aws configure --profile nypl-digital-dev

Pass in the correct credentials and now we can start deploying.

### Configuration
Run `eb init` at the root of this repo with the default settings. Then update the `.elasticbeanstalk/config.yml` file with the correct configuration for either the development or production account.

Right now, the production site has an SSL certification which is committed to the repo in `.ebextensions/01_loadbalancer-terminatehttps.config`. This will fail to upload to the development site since they are both two different accounts.

To remedy this, the `dev-eb-deploy` branch does not have that file committed and it can be used to deploy to the development account.

### Deployment
The `.elasticbeanstalk/config.yml` file needs to be updated before deploying. If deploying to the development account, the `application_name` needs to change to `discovery`, and if deploying to the production account, the `application_name` needs to change to `discovery-ui`.

|   | Development | Production
|---|---|---|
| Application Name | discovery | discovery-ui
| Environment Name | discovery-ui-dev | discovery-ui
----
Deploy to the dev server:

- Merge feature branches to `dev-eb-deploy`
- Update `.elasticbeanstalk/config.yml`:
```
    branch-defaults:
      dev-eb-deploy:
        environment: discovery-ui-dev
        group_suffix: null
      master:
        environment: discovery-ui
        group_suffix: null
    global:
      application_name: discovery
```
- Run `eb deploy discovery-ui-dev --profile default`

----
Deploy to the production server:

- Merge working and approved changes up to `master`
- Update `.elasticbeanstalk/config.yml`:
```
    branch-defaults:
      dev-eb-deploy:
        environment: discovery-ui-dev
        group_suffix: null
      master:
        environment: discovery-ui
        group_suffix: null
    global:
      application_name: discovery-ui
```
- Run `eb deploy discovery-ui --profile nypl-digital-dev`
