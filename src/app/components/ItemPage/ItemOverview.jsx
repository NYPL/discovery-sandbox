import React from 'react';

class ItemOverview extends React.Component {
  getItem(data) {
    if (!data.length) {
      return null;
    }

    return data.map((item) => {
      return [
        (<dt dangerouslySetInnerHTML={this.createMarkup(item.term)}></dt>),
        (<dd>{item.definition}</dd>),
      ];
    });
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

ItemOverview.propTypes = {
  data: React.PropTypes.array,
};

export default ItemOverview;
