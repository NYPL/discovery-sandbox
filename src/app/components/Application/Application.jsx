import React from 'react';
import PropTypes from 'prop-types';
import DocumentTitle from 'react-document-title';
import { pick as _pick } from 'underscore';
import { useLocation } from 'react-router-dom';

import { Header, navConfig } from '@nypl/dgx-header-component';
import Footer from '@nypl/dgx-react-footer';

import RouterSwitch from '../../routes/RouterSwitch'
import Feedback from '../Feedback/Feedback';

const Application = (props) => {
  let location = useLocation()

  return (
    <DocumentTitle title="Shared Collection Catalog | NYPL">
      <div className="app-wrapper">
        <Header
          navData={navConfig.current}
          skipNav={{ target: 'mainContent' }}
          // patron={this.state.patron}
          />
        <RouterSwitch routerProps={props}/>
        <Footer />
        <Feedback location={location} />
      </div>
    </DocumentTitle>
  );
}

export default Application;
