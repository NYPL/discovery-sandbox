import appConfig from '../../app/data/appConfig';
import nyplApiClient from '../../server/routes/nyplApiClient';

function requireUser(req, res) {
  console.log('requireUser: ', req);
  res.respond = req.originalUrl.includes('clientRedirect') ? res.json : res.redirect;
  if (!req.patronTokenResponse || !req.patronTokenResponse.isTokenValid ||
    !req.patronTokenResponse.decodedPatron || !req.patronTokenResponse.decodedPatron.sub) {
    // redirect to login
    let fullUrl;
    if (!req.originalUrl.includes('clientRedirect')) {
      console.log('require user if clause');
      fullUrl = encodeURIComponent(`${req.protocol}://${req.get('host')}${req.originalUrl}`);
    } else {
      console.log('require user else clause ', req.query.clientRedirect);
      fullUrl = req.query.clientRedirect;
    }
    console.log('user responding: ', `${appConfig.loginUrl}?redirect_uri=${fullUrl}`);
    res.respond(`${appConfig.loginUrl}?redirect_uri=${fullUrl}`);
    return false;
  }
  return true;
}

function eligibility(req, res) {
  if (!req.patronTokenResponse || !req.patronTokenResponse.decodedPatron || !req.patronTokenResponse.decodedPatron.sub) {
    res.send(JSON.stringify({ eligibility: true }));
  }
  const id = req.patronTokenResponse.decodedPatron.sub;
  nyplApiClient().then(client => client.get(`/patrons/${id}/hold-request-eligibility`, { cache: false }))
    .then((response) => { res.send(JSON.stringify(response)); });
}

export default { eligibility, requireUser };
