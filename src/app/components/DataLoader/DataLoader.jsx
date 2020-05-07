import React from 'react';
import PropTypes from 'prop-types';
import Actions from '@Actions';
import { ajaxCall } from '@utils';
import appConfig from '@appConfig';

class DataLoader extends React.Component {
  constructor(props) {
    super(props);
    this.pathInstructions = [
      {
        expression: /\/research\/collections\/shared-collection-catalog\/bib\/([cp]?b\d*)/,
        pathType: 'bib',
      },
    ];
    this.pathType = null;
    this.routes = {
      bib: {
        apiRoute: matchData => `${appConfig.baseUrl}/api/bib?bibId=${matchData[1]}`,
        actions: [Actions.updateBib],
        errorMessage: 'Error attempting to make an ajax request to fetch a bib record from ResultsList',
      },
    };
    this.reducePathExpressions = this.reducePathExpressions.bind(this);
  }

  componentDidMount() {
    const matchData = this.pathInstructions
      .reduce(this.reducePathExpressions, null);

    if (this.routes[this.pathType]) {
      const {
        apiRoute,
        actions,
        errorMessage,
      } = this.routes[this.pathType];
      Actions.updateLoadingStatus(true);
      ajaxCall(apiRoute(matchData),
        (response) => {
          actions.forEach(action => action(response.data));
          Actions.updateLoadingStatus(false);
        },
        (error) => {
          Actions.updateLoadingStatus(false);
          console.error(
            errorMessage,
            error,
          );
        },
      );
    }
  }

  reducePathExpressions(acc, instruction) {
    const { location } = this.context.router;
    const matchData = location.pathname.match(instruction.expression);
    if (matchData) this.pathType = instruction.pathType;
    return matchData || acc;
  }

  render() {
    return (
      <React.Fragment>{this.props.children}</React.Fragment>
    );
  }
}

DataLoader.contextTypes = {
  router: PropTypes.object,
};

export default DataLoader;
