# AWS Elastic Beanstalk Environment Variables

As previously mentioned in the [README](README.md), we are using environment variables to make authorized requests to NYPL's API platform. In order to be secure, we are encrypting and decrypting those environment variables using AWS KMS. Please get these variables from someone in the NYPL Digital Department.

 * `KMS_ENV`: Determines whether to interpret ..CLIENT_ID and ..CLIENT_SECRET variables as 'encrypted' or 'unencrypted'. Default 'encrypted'
 * `PLATFORM_API_CLIENT_ID`: Platfrom client id. If KMS_ENV is "encrypted", this value must be encrypted.
 * `PLATFORM_API_CLIENT_SECRET`: Platfrom client secret. If KMS_ENV is "encrypted", this value must be encrypted.
 * `PLATFORM_API_BASE_URL`: Platform api base url (e.g. "http://example.com/api/v0.1")

### Encrypting

Two variables are assumed encrypted when `KMS_ENV` is "encrypted": `PLATFORM_API_CLIENT_ID` and `PLATFORM_API_CLIENT_SECRET`. We need these variables to create an instance of the `nypl-data-api-client` npm package and make authorized requests to the NYPL Digital API endpoints. This is needed for the Discovery UI app to make requests itself to the APIs.

In order to encrypt, please use the `aws` [cli tool](https://aws.amazon.com/cli/). The command to encrypt is

    aws kms encrypt --key-id [your IAM key from AWS] --plaintext [value to encrypt] --output text --query CiphertextBlob

The `aws kms encrypt` commands returns and object with a `CiphertextBlob` property. Since we only want that value, we use the `--query` flag to retrieve just that. This value can be copied and pasted into the AWS EBS configuration in the UI for the app's environment.

More information can be found in the [encrypt docs](http://docs.aws.amazon.com/cli/latest/reference/kms/encrypt.html).

NOTE: This value is base64 encoded, so when decoding make sure to decode using base64.

### Decrypting

In order to decrypt, we are using the `aws-sdk` npm module. Please check the [nyplApiClient](src/server/routes/nyplApiClient/index.js) file for more information and implementation on decryption.
