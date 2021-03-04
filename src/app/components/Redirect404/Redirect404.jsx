import React from 'react';
import DocumentTitle from 'react-document-title';
import PropTypes from 'prop-types';
import appConfig from '../../data/appConfig';

const Redirect404 = (props, context) => {

  const originalUrl = context &&
    context.router &&
    context.router.location &&
    context.router.location.query &&
    context.router.location.query.originalUrl;

  const {
    circulatingCatalog,
    classicCatalog,
  } = appConfig;

  console.log('query: ', originalUrl);

  return (
    <div className="redirect404 layout-container">
      <div className="redirect404text">
        <h1>{"We're Sorry..."}</h1>
        <br />
        <p>
          {"You've followed an out-of-date link to our research catalog."}
          <br />
          <div className="originalUrlText">
            <span>{ originalUrl ? `URL: ${originalUrl}` : ''}</span>
          </div>
          <br />
          {"You can find what you're looking for by searching the"} <a href={circulatingCatalog}>Circulating Catalog.</a>
        <br />
        You can also search the <a href={classicCatalog}>Legacy Catalog.</a>
    </p>
      </div>
    </div>
  );
};


Redirect404.contextTypes = {
  router: PropTypes.object,
};

export default Redirect404;
