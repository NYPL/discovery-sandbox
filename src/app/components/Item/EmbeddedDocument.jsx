import React from 'react';
import PropTypes from 'prop-types';

class EmbeddedDocument extends React.Component {

  createMarkup(markup) {
    return { __html: markup };
  }

  render() {
    if (!this.props.embedURL || !this.props.embedURL.length) {
      return null;
    }

    return (
      <div className="item-document-viewer">
        <h2><a name="view-document"></a>{this.props.title}</h2>
        <p>A digital version of this item has been made available by {this.props.owner} and embedded below. You can also <a href={this.props.externalURL} target="_blank">view this item on {this.props.owner}</a>.</p>
        <iframe tabIndex="-1" width="700" height="450" src={this.props.embedURL} title="Hathi Trust embedded document"></iframe>
      </div>
    );
  }
}

EmbeddedDocument.propTypes = {
  title: PropTypes.string,
  owner: PropTypes.string,
  externalURL: PropTypes.string,
  embedURL: PropTypes.string
};

export default EmbeddedDocument;
