import appConfig from '../../app/data/appConfig';
import nyplApiClient from '../../server/routes/nyplApiClient';

function requireUser(req, res) {
  let redirect = false;
  console.log('token: ', req.patronTokenResponse)
  if (!req.patronTokenResponse || !req.patronTokenResponse.isTokenValid ||
    !req.patronTokenResponse.decodedPatron || !req.patronTokenResponse.decodedPatron.sub) {
    // redirect to login
    console.log('original: ', req.originalUrl)
    const originalUrl = req.originalUrl.replace(new RegExp(`^${appConfig.baseUrl}/api/`), `${appConfig.baseUrl}/`)
    const fullUrl = encodeURIComponent(`${req.protocol}://${req.get('host')}${originalUrl}`);
    redirect = `${appConfig.loginUrl}?redirect_uri=${fullUrl}`;
    if (!req.originalUrl.includes('/api/')) {
      res.redirect(redirect);
    }
  }
  return { redirect };
}

function eligibility(req, res) {
  console.log('calling eligibility')
  let redirect = false;
  if (!req.patronTokenResponse || !req.patronTokenResponse.decodedPatron
     || !req.patronTokenResponse.decodedPatron.sub) {
    return { redirect };
  }
  const id = req.patronTokenResponse.decodedPatron.sub;
  return nyplApiClient().then(client => client.get(`/patrons/${id}/hold-request-eligibility`, { cache: false }))
    .then((response) => {
      console.log('check patron eligibility response: ', JSON.stringify(response, null, 2))
        if (response.eligibility && response.eligibility !== true) {
          const fullUrl = encodeURIComponent(`${req.protocol}://${req.get('host')}${req.originalUrl}`);
          const bibId = req.params.bibId; // would these ever not exist?
          const itemId = req.params.itemId;
          const message = response.eligibility;
          redirect = `${appConfig.baseUrl}/hold/confirmation/${bibId}-${itemId}?errorStatus=eligibility&errorMessage=${message}`
          if (!fullUrl.includes('%2Fapi%2F')) {
            res.redirect(redirect);
          }
        }
        return { redirect }
    });
}

export default { eligibility, requireUser };
