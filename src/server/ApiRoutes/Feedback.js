import aws from 'aws-sdk';

import appConfig from '../../app/data/appConfig';

export default {
  post: (req, res) => {
    if (!req.body) return res.status(400).json({ error: 'Malformed request' });
    if (!req.body.fields) return res.status(400).json({ error: 'Request body missing `field` key' });

    const { fields } = req.body;

    aws.config.update({ region: 'us-east-1' });

    const emailText = Object.entries(fields).map(([field, value]) => `${field}: ${value}`).join(', ');
    const emailHtml = `<div>${Object.entries(fields).map(([field, value]) => `<p>${field}: ${value}</p>`).join('')}</div>`;

    // Create sendEmail params
    const params = {
      Destination: { /* required */
        ToAddresses: [appConfig.libAnswersEmail],
      },
      Message: { /* required */
        Body: { /* required */
          Html: {
            Charset: 'UTF-8',
            Data: emailHtml,
          },
          Text: {
            Charset: 'UTF-8',
            Data: emailText,
          },
        },
        Subject: {
          Charset: 'UTF-8',
          Data: 'Test email',
        },
      },
      Source: appConfig.sourceEmail, /* required */
      ReplyToAddresses: [fields.email],
    };

    // Create the promise and SES service object
    const sendPromise = new aws.SES({ apiVersion: '2010-12-01' }).sendEmail(params).promise();

    return sendPromise
      .then(data => console.log(data))
      .catch(err => console.error(err, err.stack));
  },
};
