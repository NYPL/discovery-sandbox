import jwt from 'jsonwebtoken';
import config from '../../../app/appConfig.js';

function initializePatronTokenAuth(req, res, next) {
  const nyplIdentityCookieString = req.cookies.nyplIdentityPatron;
  const nyplIdentityCookieObject = nyplIdentityCookieString ?
    JSON.parse(nyplIdentityCookieString) : {};

  if (nyplIdentityCookieObject && nyplIdentityCookieObject.access_token) {
    return jwt.verify(nyplIdentityCookieObject.access_token, config.publicKey, (error, decoded) => {
      if (error) {
        // Token has expired, need to refresh token
        req.patronTokenResponse = {
          isTokenValid: false,
          errorCode: error.message,
        };
        return next();
      }

      // Token has been verified, initialize user session
      req.patronTokenResponse = {
        isTokenValid: true,
        decodedPatron: decoded,
        errorCode: null,
      };
      // Continue next function call
      return next();
    });
  }
  // Token is undefined from the cookie
  req.patronTokenResponse = {
    isTokenValid: false,
    errorCode: 'token undefined',
  };
  return next();
}

export default initializePatronTokenAuth;
