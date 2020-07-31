import axios from 'axios';

import appConfig from '../../app/data/appConfig';

export default {
  post: (req, res) => {
    if (!req.body) return res.json({ error: 'Malformed request' });
    if (!req.body.fields) return res.json({ error: 'Request body missing `field` key' });
    const { fields } = req.body;
    return axios({
      method: 'POST',
      url: appConfig.feedbackFormUrl,
      data: {
        fields,
      },
      headers: {
        Authorization: `Bearer ${appConfig.airtableApiKey}`,
        'Content-Type': 'application/json',
      },
    }).then(postResp => res.json(postResp.data)).catch(error => res.json({ error }));
  },
};
