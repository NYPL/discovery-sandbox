import React from 'react';
import PropTypes from 'prop-types';

class BibDetails extends React.Component {
  getItem(data) {
    if (!data.length) {
      return null;
    }

    return data.map((item) => ([
      (<dt dangerouslySetInnerHTML={this.createMarkup(item.term)}></dt>),
      (<dd>{item.definition}</dd>),
    ]));
  }

  createMarkup(markup) {
    return { __html: markup };
  }

  render() {
    if (!this.props.data.length) {
      return null;
    }

    return (
      <div>
        <dl>
          {this.getItem(this.props.data)}
        </dl>
      </div>
    );
  }
}

BibDetails.propTypes = {
  data: PropTypes.array,
};

export default BibDetails;
