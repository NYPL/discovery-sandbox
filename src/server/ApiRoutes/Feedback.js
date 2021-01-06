import aws from 'aws-sdk';

import appConfig from '../../app/data/appConfig';
import { encodeHTML } from '../../app/utils/utils';

export default {
  post: (req, res) => {
    if (!req.body) return res.status(400).json({ error: 'Malformed request' });
    if (!req.body.fields) return res.status(400).json({ error: 'Request body missing `field` key' });

    aws.config.update({ region: 'us-east-1' });

    const { fields } = req.body;

    const submissionText = Object.entries(fields).map(([field, value]) => `${field}: ${encodeHTML(value)}`).join(', ');
    const emailText = `Question/Feedback from Research Catalog (SCC): ${submissionText}`;

    const emailHtml = `<div>
    <h1>Question/Feedback from Research Catalog (SCC):</h1>
    ${Object.entries(fields).map(([field, value]) => `<p>${field}: ${encodeHTML(value).replace(/\\n/g, '<br/>')}</p>`).join('')}
    </div>`;

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
          Data: 'SCC Feedback',
        },
      },
      Source: appConfig.sourceEmail, /* required */
      ReplyToAddresses: [fields.email],
    };

    // Create the promise and SES service object
    const sendPromise = new aws.SES({ apiVersion: '2010-12-01' }).sendEmail(params).promise();

    return sendPromise
      .then(data => res.json(data))
      .catch(err => console.error(err, err.stack));
  },
};
