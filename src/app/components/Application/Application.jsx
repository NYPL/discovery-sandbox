import React from 'react';

import { Header, navConfig } from '@nypl/dgx-header-component';
import Footer from '@nypl/dgx-react-footer';

import Feedback from '../Feedback/Feedback.jsx';
import Store from '../../stores/Store.js';
import PatronStore from '../../stores/PatronStore.js';
import {
  collapse,
  ajaxCall,
  createAppHistory,
} from '../../utils/utils.js';
import Actions from '../../actions/Actions.js';

const history = createAppHistory();

history.listen(location => {
  const {
    action,
    search,
    query,
    state,
  } = location;
  console.log(action, search, query, state);

  // if (state === null) {
  //   history.push({
  //     state: { start: true },
  //     search,
  //   });
  // }
  //
  if (action === 'POP' && search) {
    ajaxCall(`/api${search}`, (response) => {
      Actions.updateSearchResults(response.data.searchResults);
      Actions.updateSearchKeywords(query.q);
    });
    // ajaxCall(search, response => {
    //   const availabilityType = availability || 'New Arrival';
    //   const publicationType = publishYear || 'recentlyReleased';
    //
    //   if (response.data && response.data.bibItems) {
    //     Actions.updateFiltered(filters);
    //     Actions.updateNewArrivalsData(response.data);
    //     Actions.updatePublicationType(publicationType);
    //     Actions.updateAvailabilityType(availabilityType);
    //   }
    // });
  }
});

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: Store.getState(),
      patron: PatronStore.getState(),
    };
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    Store.listen(this.onChange);
  }

  componentWillMount() {
    if (!this.state.data.searchResults) {
      ajaxCall(`/api?q=${this.state.data.searchKeywords}`, (response) => {
        Actions.updateSearchResults(response.data.searchResults);
        Actions.updateSearchKeywords(this.state.data.searchKeywords);
      });
    }
  }

  componentWillReceiveProps(t,w) {
    // console.log(this.state.data, w);
    // console.log(w);
    // if (this.state.data.searchKeywords !== w.data.searchKeywords) {
    //   console.log('TEST');
    //   ajaxCall(`/api?q=${w.data.searchKeywords}`, (response) => {
    //     Actions.updateSearchResults(response.data.searchResults);
    //     Actions.updateSearchKeywords(this.state.data.searchKeywords);
    //   });
    // }
  }

  componentWillUnmount() {
    Store.unlisten(this.onChange);
  }

  onChange() {
    this.setState({ data: Store.getState() });
  }

  render() {
    return (
      <div className="app-wrapper">
        <Header navData={navConfig.current} skipNav={{ target: 'mainContent' }} />

        {React.cloneElement(this.props.children, this.state.data)}

        <Footer />

        <Feedback location={this.props.location} />
      </div>
    );
  }
}

App.propTypes = {
  children: React.PropTypes.object,
};

App.contextTypes = {
  router: function contextType() {
    return React.PropTypes.func.isRequired;
  },
};


export default App;
