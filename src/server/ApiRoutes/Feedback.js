import aws from 'aws-sdk';

import appConfig from '../../app/data/appConfig';
import { encodeHTML } from '../../app/utils/utils';

export default {
  post: (req, res) => {
    if (!req.body) return res.status(400).json({ error: 'Malformed request' });
    if (!req.body.fields) return res.status(400).json({ error: 'Request body missing `field` key' });

    aws.config.update({ region: 'us-east-1' });

    const { fields } = req.body;
    const fullUrl = encodeHTML(req.headers.referer);

    const submissionText = ['Email', 'Feedback'].map(label => `${label}: ${encodeHTML(fields[label.toLowerCase()])}`).join(', ');
    const emailText = `Question/Feedback from Research Catalog (SCC): ${submissionText} URL: ${fullUrl}`;

    const emailHtml = `
      <div>
        <h1>Question/Feedback from Research Catalog (SCC):</h1>
        <dl>
          ${['Email', 'Feedback'].map(label => `
            <dt>${label}:</dt>
            <dd>${encodeHTML(fields[label.toLowerCase()]).replace(/\\n/g, '<br/>')}</dd>
          `).join('')}
          <dt>URL:</dt>
          <dd>${fullUrl}</dd>
        </dl>
      </div>
    `;

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
      ReplyToAddresses: [fields.email || appConfig.sourceEmail],
    };

    // Create the promise and SES service object
    const sendPromise = new aws.SES({ apiVersion: '2010-12-01' }).sendEmail(params).promise();

    return sendPromise
      .then(data => res.json(data))
      .catch(err => console.error(err, err.stack));
  },
};
