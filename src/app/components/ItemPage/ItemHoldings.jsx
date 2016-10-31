import React from 'react';

class ItemHoldings extends React.Component {
  getHeading(headings) {
    return (
      <thead>
        <tr>
          {headings.map((h, i) => (<th key={i}>{h}</th>))}
        </tr>
      </thead>
    );
  }

  getRow(holdings) {
    return (
      <tbody>
        {
          holdings.map((h, i) => (
            <tr className={h.className} key={i}>
              <td dangerouslySetInnerHTML={this.createMarkup(h.available)}></td>
              <td dangerouslySetInnerHTML={this.createMarkup(h.location)}></td>
              <td dangerouslySetInnerHTML={this.createMarkup(h.callNumber)}></td>
              <td className="align-right">{h.hold}</td>
            </tr>
          ))
        }
        {/*
        <tr className="more">
          <td colSpan="4">
            <a href="#see-more" className="more-link">See 2 more copies</a>
          </td>
        </tr>
        */}
      </tbody>
    );
  }

  createMarkup(html) {
    return {
      __html: html,
    };
  }

  render() {
    const headings = ['Status', 'Location', 'Call Number', ''];

    const heading = this.getHeading(headings);
    const body = this.getRow(this.props.holdings);

    return (
      <div className="item-holdings">
        <h2>{this.props.title}</h2>
        <table className="generic-table holdings-table">
          {heading}
          {body}
        </table>
      </div>
    );
  }
}

ItemHoldings.propTypes = {
  holdings: React.PropTypes.array,
};

export default ItemHoldings;
