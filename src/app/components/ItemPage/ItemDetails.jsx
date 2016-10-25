import React from 'react';

class ItemDetails extends React.Component {
  createMarkup(markup) {
    return { __html: markup };
  }

  getItem(data) {
    if (!data.length) {
      return null;
    }

    return data.map((item, i) => {
      return [
        (<dt dangerouslySetInnerHTML={this.createMarkup(item.term)}></dt>),
        (<dd dangerouslySetInnerHTML={this.createMarkup(item.definition)}></dd>),
      ];
    });
  }

  render() {
    if (!this.props.data.length || !this.props.title) {
      return null;
    }

    return (
      <div>
        <h2>{this.props.title}</h2>
        <dl>
          {this.getItem(this.props.data)}
        </dl>
      </div>
    );
  }
}

ItemDetails.propTypes = {
  title: React.PropTypes.string,
  data: React.PropTypes.array,
};

export default ItemDetails;
