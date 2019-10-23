import React from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';

class BibsList extends React.Component {
  render() {
    const bibLis = this.props.bibs.map(bib=> {
        return (
          <li key={bib.bnumber}>
            {bib.title}
          </li>
        )
      }
    )

    return (
      <div>
        <h3>Titles</h3>
        <ul className="bibs-list">
          {bibLis}
        </ul>
      </div>
    )
  }
}

export default BibsList;
