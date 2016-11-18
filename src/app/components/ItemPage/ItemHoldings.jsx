import React from 'react';
import { Link } from 'react-router';

class ItemHoldings extends React.Component {
  constructor(props) {
    super(props);

    this.state ={
      expanded: false
    };
  }

  getHeading(headings) {
    return (
      <thead>
        <tr>
          {headings.map((h, i) => (<th scope="col" key={i}>{h}</th>))}
        </tr>
      </thead>
    );
  }

  showMoreItems(e){
    e.preventDefault();
    this.setState({ expanded: true });
  }

  getRow(holdings) {
    const holdingCount = holdings.length;
    const maxDisplay = 7;
    const moreCount = holdingCount - maxDisplay;
    const collapsed = !this.state.expanded;

    return (
      <tbody>
        {
          holdings.map((h, i) => (
            <tr className={`${h.availability} ${i>=maxDisplay && collapsed ? 'collapsed' : ''}`} key={i}>
              <td dangerouslySetInnerHTML={this.createMarkup(`<span class="status ${h.availability}">${h.status}</span>`)}></td>
              <td dangerouslySetInnerHTML={this.createMarkup(h.location)}></td>
              <td dangerouslySetInnerHTML={this.createMarkup(h.callNumber)}></td>
              <td className="align-right">{h.url && h.url.length ?
                <a
                  href={h.url}
                  className="button">
                  {h.actionLabel}
                </a>
              : null}</td>
            </tr>
          ))
        }
        {
          moreCount > 0 && collapsed ?
            (
              <tr className="more">
                <td colSpan="4">
                  <Link
                    onClick={(e) => this.showMoreItems(e)}
                    href="#see-more"
                    className="more-link">
                    See {moreCount} more {moreCount > 1 ? 'copies' : 'copy'}
                  </Link>
                </td>
              </tr>
            )
            : null
        }
      </tbody>
    );
  }

  createMarkup(html) {
    return {
      __html: html,
    };
  }

  render() {
    const headings = ['Status', 'Location', 'Call Number', 'Hold/View'];

    const holdings = this.props.holdings;
    const heading = this.getHeading(headings);
    const body = this.getRow(holdings);

    return (
      <div className="item-holdings">
        <h2>{this.props.title}</h2>
        <table className="generic-table holdings-table">
          <caption className="visuallyHidden">Item availability, location, call number, and request a hold.</caption>
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
