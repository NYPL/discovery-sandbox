import appConfig from '../../../appConfig';
import nyplApiClient from '../../server/routes/nyplApiClient';

function requireUser(req, res) {
  if (!req.patronTokenResponse || !req.patronTokenResponse.isTokenValid ||
    !req.patronTokenResponse.decodedPatron || !req.patronTokenResponse.decodedPatron.sub) {
    // redirect to login
    const fullUrl = encodeURIComponent(`${req.protocol}://${req.get('host')}${req.originalUrl}`);

    res.redirect(`${appConfig.loginUrl}?redirect_uri=${fullUrl}`);
    return false;
  }
  return true;
}

function eligibility(req, res) {
  console.log(req.patronTokenResponse.decodedPatron.sub);
  const id = req.patronTokenResponse.decodedPatron.sub;
  nyplApiClient().then(client => client.get(`/patrons/${id}/hold-request-eligibility`, { cache: false }))
    .then((response) => { console.log('thennnn', response); res.send(JSON.stringify(response)); }
    );
}

export default { eligibility, requireUser };
