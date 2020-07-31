import axios from 'axios';

import appConfig from '../../app/data/appConfig';

export default {
  post: (req, res) => {
    if (!req.body) return res.status(400).json({ error: 'Malformed request' });
    if (!req.body.fields) return res.status(400).json({ error: 'Request body missing `field` key' });

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
    }).then((postResp) => {
      return res.json(postResp.data);
    }).catch(error => res.status(500).json({ error }));
  },
};
