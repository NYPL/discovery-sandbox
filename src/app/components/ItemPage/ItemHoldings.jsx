import React from 'react';
import { Link } from 'react-router';

class ItemHoldings extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      expanded: false,
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

  getRow(holdings) {
    const holdingCount = holdings.length;
    const maxDisplay = 7;
    const moreCount = holdingCount - maxDisplay;
    const collapsed = !this.state.expanded;

    return (
      <tbody>
        {
          holdings.map((h, i) => (
            <tr
              key={i}
              className={`${h.availability} ${i >= maxDisplay && collapsed ? 'collapsed' : ''}`}
            >
              <td dangerouslySetInnerHTML={this.createMarkup(this.getAvailability(h))}></td>
              <td dangerouslySetInnerHTML={this.createMarkup(h.location)}></td>
              <td dangerouslySetInnerHTML={this.createMarkup(h.callNumber)}></td>
              <td>
                {
                  h.url && h.url.length ?
                    <a
                      href={h.url}
                      className="button"
                    >
                      {h.actionLabel}
                    </a>
                  : null
                }
              </td>
            </tr>
          ))
        }
        {
          moreCount > 0 && collapsed ?
            (<tr className="more">
              <td colSpan="4">
                <Link
                  onClick={(e) => this.showMoreItems(e)}
                  href="#see-more"
                  className="more-link"
                >
                  See {moreCount} more {moreCount > 1 ? 'copies' : 'copy'}
                </Link>
              </td>
            </tr>)
            : null
        }
      </tbody>
    );
  }

  getAvailability(hold) {
    return `<span class="status ${hold.availability}">${hold.status}</span>`;
  }

  showMoreItems(e) {
    e.preventDefault();
    this.setState({ expanded: true });
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
        <table className="holdings-table">
          <caption className="visuallyHidden">
            Item availability, location, call number, and request a hold.
          </caption>
          {heading}
          {body}
        </table>
      </div>
    );
  }
}

ItemHoldings.propTypes = {
  holdings: React.PropTypes.array,
  title: React.PropTypes.string,
};

export default ItemHoldings;
