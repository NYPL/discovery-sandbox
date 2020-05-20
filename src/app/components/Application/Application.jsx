/* global window */
import React from 'react';
import PropTypes from 'prop-types';
import DocumentTitle from 'react-document-title';
import { pick as _pick } from 'underscore';

import { Header, navConfig } from '@nypl/dgx-header-component';
import Footer from '@nypl/dgx-react-footer';

import Feedback from '../Feedback/Feedback';
import Store from '../../stores/Store';
import PatronStore from '../../stores/PatronStore';
import {
  ajaxCall,
  destructureFilters,
  basicQuery,
} from '../../utils/utils';
import Actions from '../../actions/Actions';
import appConfig from '../../data/appConfig';
import DataLoader from '../DataLoader/DataLoader';

class Application extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: Store.getState(),
      patron: PatronStore.getState(),
      media: 'desktop',
    };
    this.onChange = this.onChange.bind(this);
    this.shouldStoreUpdate = this.shouldStoreUpdate.bind(this);
    this.checkMedia = this.checkMedia.bind(this);
  }

  getChildContext() {
    return { media: this.state.media };
  }

  componentDidMount() {
    Store.listen(this.onChange);
    // Listen to the browser's navigation buttons.
    this.props.route.history.listen((location = { action: '', search: '', query: {} }) => {
      const {
        action,
        search,
        query,
      } = location;

      const qParameter = query.q;
      const urlFilters = _pick(query, (value, key) => {
        if (key.indexOf('filter') !== -1) {
          return value;
        }
        return null;
      });

      if (action === 'POP' && search && this.shouldStoreUpdate()) {
        Actions.updateLoadingStatus(true);
        ajaxCall(`${appConfig.baseUrl}/api${decodeURI(search)}`, (response) => {
          const { data } = response;
          if (data.filters && data.searchResults) {
            const selectedFilters = destructureFilters(urlFilters, data.filters);
            Actions.updateSelectedFilters(selectedFilters);
            Actions.updateFilters(data.filters);
            Actions.updateSearchResults(data.searchResults);
            Actions.updatePage(query.page || '1');
            if (qParameter) Actions.updateSearchKeywords(qParameter);
            Actions.updateLoadingStatus(false);
          }
        });
      }
    });
    const style = {
      xtrasmallBreakPoint: '483px',
    };
    const mediaMatcher = window.matchMedia(`(max-width: ${style.xtrasmallBreakPoint})`);
    this.checkMedia(mediaMatcher);
    mediaMatcher.addListener(this.checkMedia);
  }

  shouldStoreUpdate() {
    return `?${basicQuery({})(Store.getState())}` !== this.context.router.location.search;
  }

  componentWillUnmount() {
    Store.unlisten(this.onChange);
  }

  onChange() {
    this.setState({ data: Store.getState() });
  }

  checkMedia(media) {
    if (media && media.matches) {
      this.setState({ media: 'mobile' });
    } else {
      this.setState({ media: 'desktop' });
    }
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
            key={JSON.stringify(dataLocation)}
          >
            {React.cloneElement(this.props.children, this.state.data)}
          </DataLoader>
          <Footer />
          <Feedback location={this.props.location} />
        </div>
      </DocumentTitle>
    );
  }
}

Application.propTypes = {
  children: PropTypes.object,
  location: PropTypes.object,
};

Application.defaultProps = {
  children: {},
  location: {},
};

Application.contextTypes = {
  router: PropTypes.object,
};

Application.childContextTypes = {
  media: PropTypes.string,
};

export default Application;
