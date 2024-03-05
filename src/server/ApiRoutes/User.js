import appConfig from '../../app/data/appConfig';
import nyplApiClient from '../../server/routes/nyplApiClient';

function requireUser(req, res) {
  let redirect = false;
  if (!req.patronTokenResponse || !req.patronTokenResponse.isTokenValid ||
    !req.patronTokenResponse.decodedPatron || !req.patronTokenResponse.decodedPatron.sub) {
    // redirect to login
    const originalUrl = req.originalUrl.replace(new RegExp(`^${appConfig.baseUrl}/api/`), `${appConfig.baseUrl}/`)
    // TODO: Express 4.x strips the port from req.hostname, inconveniencing
    // local development. May cautiously retrieve it from headers or local config
    const fullUrl = encodeURIComponent(`${req.protocol}://${req.hostname}${originalUrl}`);
    redirect = `${appConfig.loginUrl}?redirect_uri=${fullUrl}`;
    if (!req.originalUrl.includes('/api/')) {
      res.redirect(redirect);
    }
  }
  return { redirect };
}

function eligibility(req, res) {
  let redirect = false;
  const id = req.patronTokenResponse.decodedPatron.sub;
  return nyplApiClient().then(client => client.get(`/patrons/${id}/hold-request-eligibility`, { cache: false }))
    .then((response) => {
        if (response.eligibility !== true) {
          const fullUrl = encodeURIComponent(`${req.protocol}://${req.get('host')}${req.originalUrl}`);
          const bibId = req.params.bibId; // would these ever not exist?
          const itemId = req.params.itemId;
          const message = JSON.stringify(response);
          redirect = `${appConfig.baseUrl}/hold/confirmation/${bibId}-${itemId}?errorStatus=eligibility&errorMessage=${message}`
          if (!fullUrl.includes('%2Fapi%2F')) {
            res.redirect(redirect);
          }
        }
        return { redirect }
    });
}

export default { eligibility, requireUser };
