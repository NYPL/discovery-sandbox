import PropTypes from 'prop-types';
import React from 'react';
import NotFound404 from '../NotFound404/NotFound404';
import Redirect404 from '../Redirect404/Redirect404';

const BibNotFound404 = ({ context }) => {
  const originalUrl =
    context &&
    context.router &&
    context.router.location &&
    context.router.location.query &&
    context.router.location.query.originalUrl;

  return originalUrl ? <Redirect404 /> : <NotFound404 />;
};

BibNotFound404.propTypes = {
  context: PropTypes.obj,
};

export default BibNotFound404;
