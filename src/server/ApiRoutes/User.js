import appConfig from '../../../appConfig.js';

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

export default { requireUser };
