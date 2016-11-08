import jwt from 'jsonwebtoken';
import config from '../../../../appConfig.js';

export function initializeTokenAuth(req, res, next) {
  const nyplIdentityCookieString = req.cookies.nyplIdentityPatron;
  const nyplIdentityCookieObject = nyplIdentityCookieString ?
    JSON.parse(nyplIdentityCookieString) : {};

  if (nyplIdentityCookieObject && nyplIdentityCookieObject.access_token) {
    jwt.verify(nyplIdentityCookieObject.access_token, config.publicKey, (error, decoded) => {
      if (error) {
        // Token has expired, need to refresh token
        req.tokenResponse = {
          isTokenValid: false,
          errorCode: error.message,
        };
        next();
        // res.redirect(`${config.loginUrl}?redirect_uri=http://local.nypl.org:3001/my-account/holds`);
      }
      // Token has been verified, initialize user session
      req.tokenResponse = {
        isTokenValid: true,
        accessToken: nyplIdentityCookieObject.access_token,
        decodedPatron: decoded,
        errorCode: null,
      };
      // Continue next function call
      next();
    });
  } else {
    // Token is undefined from the cookie
    req.tokenResponse = {
      isTokenValid: false,
      errorCode: 'token undefined',
    };
    next();

    // Continue next function call
    // res.redirect(`${config.loginUrl}?redirect_uri=http://local.nypl.org:3001/my-account/holds`);
  }
}
