import React from 'react';
import PropTypes from 'prop-types';
import Actions from '@Actions';
import bibSearchServer from '@Bib';

class DataLoader extends React.Component {
  constructor(props) {
    super(props);
    this.routes = {
      bibRoute: {
        fetchFunction: bibSearchServer,
        req: { params: { bibId: '' } },
      },
    };
    this.res = {};
    this.actions = {
      bib: Actions.updateBib,
      searchKeywords: Actions.updateSearchKeywords,
    };
    this.next = () => {
      const { Store } = this.res.locals.data;
      Object.keys(Store).forEach((key) => {
        this.actions[key](Store[key]);
      });
      Actions.updateLoadingStatus(false);
    };
  }

  componentDidMount() {
    this.res = {};
    const { location } = this.context.router;
    Object.keys(this.routes).forEach((route) => {
      if (route.match(location)) {
        Actions.updateLoadingStatus(true);
        this.routes[route].fetchFunction(location)(
          this.routes[route].req(location),
          this.res,
          this.next,
        );
      }
    });
  }

  render() {
    return (
      <div className="dataLoader" />
    );
  }
}


DataLoader.contextTypes = {
  router: PropTypes.object,
};

export default DataLoader;
