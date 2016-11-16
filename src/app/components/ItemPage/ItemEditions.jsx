import React from 'react';
import axios from 'axios';

import ResultList from '../Results/ResultsList.jsx';

class ItemEditions extends React.Component {

  constructor(props) {
    super(props);

    this.state ={
      results: []
    };
  }

  componentWillMount() {
    const record = this.props.item;
    const idOwi = record.idOwi && record.idOwi.length ? record.idOwi[0] : null;

    if (idOwi) {
      axios
        .get(`http://discovery-api.nypltech.org/api/v1/resources?q=${encodeURIComponent(`idOwi:"${idOwi}"`)}`)
        .then(response => {
          if (response.data && response.data.itemListElement && response.data.itemListElement.length) {
            const results = response.data.itemListElement.filter((item, i) => { return item.result['@id'] != record['@id']; });
            if (results.length) {
              this.setState({ results: results });
            }
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  }

  createMarkup(markup) {
    return { __html: markup };
  }

  render() {
    if (!this.state.results.length) return null;

    const title = this.props.title;

    return (
      <div className="item-details">
        <h2>
          <a name="editions"></a>Formats and editions related to "{title}"
        </h2>

        <ResultList results={this.state.results} />
      </div>
    );
  }
}

ItemEditions.propTypes = {
  title: React.PropTypes.string,
  item: React.PropTypes.object
};

export default ItemEditions;
