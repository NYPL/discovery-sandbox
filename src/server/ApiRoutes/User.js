import appConfig from '../../../appConfig.js';

function requireUser(req, res) {
  console.log(req);
  if (!req.tokenResponse || !req.tokenResponse.isTokenValid ||
    !req.tokenResponse.accessToken || !req.tokenResponse.decodedPatron ||
    !req.tokenResponse.decodedPatron.sub) {
    // redirect to login
    // const fullUrl = encodeURIComponent(`${req.protocol}://${req.get('host')}${req.originalUrl}`);

    // res.redirect(`${appConfig.loginUrl}?redirect_uri=${fullUrl}`);
    return false;
  }
  return true;
}

export default { requireUser };
