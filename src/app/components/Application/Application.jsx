/* global window */
import React from 'react';
import PropTypes from 'prop-types';
import DocumentTitle from 'react-document-title';

import { Header, navConfig } from '@nypl/dgx-header-component';
import Footer from '@nypl/dgx-react-footer';

import Feedback from '../Feedback/Feedback';
import Store from '../../stores/Store';
import PatronStore from '../../stores/PatronStore';
import {
  basicQuery,
} from '../../utils/utils';

import { breakpoints } from '../../data/constants';
import DataLoader from '../DataLoader/DataLoader';
import appConfig from '../../data/appConfig';

class Application extends React.Component {
  constructor(props, context) {
    super(props, context);
    const {
      query,
    } = context.router.location;
    this.state = {
      data: Store.getState(),
      patron: PatronStore.getState(),
      media: 'desktop',
    };
    this.onChange = this.onChange.bind(this);
    this.submitFeedback = this.submitFeedback.bind(this);

    const urlEnabledFeatures = query.features ? query.features.split(',') : null;
    if (urlEnabledFeatures) {
      const urlFeaturesString = urlEnabledFeatures.filter(
        urlFeat => !appConfig.features.includes(urlFeat))
        .join(',');
      if (urlFeaturesString) this.state.urlEnabledFeatures = urlFeaturesString;
    }
  }

  getChildContext() {
    return {
      media: this.state.media,
    };
  }

  componentDidMount() {
    Store.listen(this.onChange);
    window.addEventListener('resize', this.onWindowResize.bind(this));
    this.onWindowResize();
    const { router } = this.context;
    if (this.state.urlEnabledFeatures) {
      router.listen(() => {
        const {
          pathname,
          query,
        } = router.location;
        if (query.features !== this.state.urlEnabledFeatures) {
          router.replace({
            pathname,
            query: Object.assign(query, { features: this.state.urlEnabledFeatures }),
          });
        }
      });
    }
  }

  componentWillUnmount() {
    Store.unlisten(this.onChange);
  }

  onWindowResize() {
    const { media } = this.state;
    const { innerWidth } = window;
    const {
      xtrasmall,
      tablet,
    } = breakpoints;

    if (innerWidth <= xtrasmall) {
      if (media !== 'mobile') this.setState({ media: 'mobile' });
    } else if (innerWidth <= tablet) {
      if (media !== 'tablet') this.setState({ media: 'tablet' });
    } else {
      if (media !== 'desktop') this.setState({ media: 'desktop' });
    }
  }

  onChange() {
    this.setState({ data: Store.getState() });
  }

  submitFeedback(callback, e) {
    e.preventDefault();
    const { pathname, hash, search } = this.context.router.location;
    const currentURL = `${pathname}${hash}${search}`;

    callback(currentURL);
  }

  render() {
    const dataLocation = Object.assign(
      {},
      this.context.router.location,
      {
        hash: null,
        action: null,
        key: null,
      },
    );

    return (
      <DocumentTitle title="Shared Collection Catalog | NYPL">
        <div className="app-wrapper">
          <Header
            navData={navConfig.current}
            skipNav={{ target: 'mainContent' }}
            patron={this.state.patron}
          />
          <DataLoader
            location={this.context.router.location}
            next={Store.next}
            key={JSON.stringify(dataLocation)}
          >
            {React.cloneElement(this.props.children, this.state.data)}
          </DataLoader>
          <Footer />
          <Feedback submit={this.submitFeedback} />
        </div>
      </DocumentTitle>
    );
  }
}

Application.propTypes = {
  children: PropTypes.object,
};

Application.defaultProps = {
  children: {},
};

Application.contextTypes = {
  router: PropTypes.object,
};

Application.childContextTypes = {
  media: PropTypes.string,
  urlEnabledFeatures: PropTypes.string,
};

export default Application;
