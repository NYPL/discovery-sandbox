import React from 'react';
import DocumentTitle from 'react-document-title';
import { Link } from 'react-router';

import appConfig from '../../data/appConfig';

const Account404 = () => (
  <DocumentTitle title={`404 | ${appConfig.displayTitle} | NYPL`}>
    <main id="mainContent" className="not-found-404">
      <div className="nypl-full-width-wrapper">
        <div className="nypl-row">
          <div className="nypl-column-three-quarters">
            <h1>404 Not Found</h1>
            <p>We're sorry...</p>
            <p>Something went wrong loading your account information.</p>
            <p>Please try again in a few minutes</p>
          </div>
        </div>
      </div>
    </main>
  </DocumentTitle>
);

export default Account404;
