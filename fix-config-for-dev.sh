# This modifies the LB https config to use a nypl-sandbox cert arn

INFILE=.ebextensions/01_loadbalancer-terminatehttps.config
PROD_CERT_ID=arn:aws:acm:us-east-1:946183545209:certificate\\/aee40806-85d9-4e4f-973d-4430105a0369
DEV_CERT_ID=arn:aws:acm:us-east-1:224280085904:certificate\\/81061d9f-0a08-4440-bdc0-016e4d40b423

echo "Testing ELASTIC_BEANSTALK_ENV=$ELASTIC_BEANSTALK_ENV, TRAVIS_BRANCH=$TRAVIS_BRANCH"

# Only perform replace if deploying to development:
if [ "$TRAVIS_BRANCH" == "development" ]; then
  echo "Patching cert id for development"
  mv $INFILE $INFILE.bak
  sed s/$PROD_CERT_ID/$DEV_CERT_ID/g $INFILE.bak > $INFILE
  rm $INFILE.bak
fi

exit 0
