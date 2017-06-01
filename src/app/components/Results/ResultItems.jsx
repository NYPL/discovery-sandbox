import React from 'react';
import { isEmpty as _isEmpty } from 'underscore';

const MAXDISPLAY = 5;

class ResultsItems extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      collapsed: true,
    };
  }

  getItems(items) {
    return items.map((item, i) => {
      const status = item.status;
      const availability = item.availability;
      const accessMessage = item.accessMessage.prefLabel;
      const available = item.available;
      const id = item.id;
      const collapsed = this.state.collapsed;

      return (
        <tr key={i} className={`sub-item ${i >= MAXDISPLAY && collapsed ? 'more' : ''}`}>
          <td>
            {item.location}
          </td>
          <td>
            {
              item.callNumber.length ? item.callNumber : null
            }
          </td>
          <td>
            {
              item.url && item.url.length ?
              (
                <a
                  href={item.url}
                  className="request-hold-link"
                >
                  {item.actionLabel}
                </a>
              )
              : null
            }
          </td>
        </tr>
      );
    });
  }

  getMoreLink(items) {
    const itemCount = items.length;
    const moreCount = itemCount - MAXDISPLAY;
    const collapsed = this.state.collapsed;
    const resultTitle = this.props.itemTitle;

    return (
      moreCount > 0 && collapsed ?
      (
        <tr className="see-more-row">
          <td colSpan="3">
            <a
              href="#"
              className="see-more-link"
              onClick={(e) => this.showMoreItems(e)}
            >
              See {moreCount} more item{moreCount > 1 ? 's' : ''}
              <span className="visuallyHidden"> in collapsed menu for {resultTitle}</span>
            </a>
          </td>
        </tr>
      )
      : null
    );
  }

  showMoreItems(e) {
    e.preventDefault();

    this.setState({ collapsed: false });
  }

  render() {
    const items = this.props.items;
    if (!items.length) {
      return null;
    }

    return (
      <div className="result-item-formats">
        <p>
          <strong>Items available:</strong>
        </p>
        <table
          tabIndex="0"
          className="sub-items result-item-formats-table"
          aria-label={`This bibliographical record has ${items.length}` +
            ` item${items.length > 1 ? 's' : ''}.`}
        >
          <thead className="visuallyHidden">
            <tr>
              <th>Item</th>
              <th>Call Number</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {this.getItems(items)}
            {this.getMoreLink(items)}
          </tbody>
        </table>
      </div>
    );
  }
}

ResultsItems.propTypes = {
  itemTitle: React.PropTypes.string,
  items: React.PropTypes.array,
};

ResultsItems.defaultProps = {
  items: [],
  itemTitle: '',
};

export default ResultsItems;
