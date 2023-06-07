/* global window */
import React from 'react';
import PropTypes from 'prop-types';
import { Header, navConfig } from '@nypl/dgx-header-component';
import Footer from '@nypl/dgx-react-footer';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { union as _union } from 'underscore';

import Feedback from '../Feedback/Feedback';
import DataLoader from '../DataLoader/DataLoader';
import appConfig from '../../data/appConfig';
import { updateFeatures } from '../../actions/Actions';
import { breakpoints } from '../../data/constants';
import { PatronProvider } from '../../context/PatronContext';
import { FeedbackBoxProvider } from '../../context/FeedbackContext';
import { trackVirtualPageView} from '../../utils/utils';

export const MediaContext = React.createContext('desktop');

export class Application extends React.Component {
  constructor (props, context) {
    super(props, context);
    const {
      query,
    } = context.router.location;
    this.state = {
      media: 'desktop',
    };

    const urlEnabledFeatures = query.features ? query.features.split(',') : null;
    if (urlEnabledFeatures) {
      const urlFeatures = urlEnabledFeatures.filter(
        urlFeat => !appConfig.features.includes(urlFeat));
      const urlFeaturesString = urlFeatures.join(',');
      if (urlFeaturesString) this.state.urlEnabledFeatures = urlFeaturesString;
      if (urlFeatures.some(urlFeat => !this.props.features.includes(urlFeat))) {
        const allFeatures = _union(this.props.features, urlFeatures);
        this.props.updateFeatures(allFeatures);
      };
    }
  }

  componentDidMount () {
    window.addEventListener('resize', this.onWindowResize.bind(this));
    this.onWindowResize();
    const { router } = this.context;
    console.log('this.state.urlEnabledFeatures', this.state.urlEnabledFeatures);
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

    // Listen for router changes and track virtual page views in Adobe Analytics
    if (router.listen) {
      router.listen(() => {
        const {
          pathname,
        } = router?.location;
        trackVirtualPageView(pathname)
      });
    }
  }

  onWindowResize () {
    const { media } = this.state;
    const { innerWidth } = window;
    const breakpoint = breakpoints.find(breakpoint => innerWidth <= breakpoint.maxValue);
    const newMedia = breakpoint && breakpoint.media ? breakpoint.media : 'desktop';
    if (media !== newMedia) this.setState({ media: newMedia });
  }

  render () {
    // dataLocation is passed as a key to DataLoader to ensure it reloads
    // whenever the location changes.
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
      <PatronProvider patron={this.props.patron}>
        <FeedbackBoxProvider>
          <MediaContext.Provider value={this.state.media}>
            <div className="app-wrapper">
              <Header
                navData={navConfig.current}
                patron={this.props.patron}
                skipNav={{ target: 'mainContent' }}
              />
              <DataLoader
                location={this.context.router.location}
                query={this.context.router.location.query}
                key={JSON.stringify(dataLocation)}
              >
                {React.cloneElement(this.props.children)}
              </DataLoader>
              <Footer />
              <Feedback />
            </div>
          </MediaContext.Provider>
        </FeedbackBoxProvider>
      </PatronProvider>
    );
  }
}

Application.propTypes = {
  children: PropTypes.object,
  patron: PropTypes.object,
  features: PropTypes.array,
  updateFeatures: PropTypes.func,
};

Application.defaultProps = {
  children: {},
};

Application.contextTypes = {
  router: PropTypes.object,
};

const mapStateToProps = ({ patron, loading, features }) => ({ patron, loading, features });

const mapDispatchToProps = dispatch => ({
  updateFeatures: features => dispatch(updateFeatures(features)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Application));
