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
      const available = item.available;
      const id = item.id;
      const collapsed = this.state.collapsed;

      return (
        <li key={i}>
          <div className={`sub-item ${i >= MAXDISPLAY && collapsed ? 'more' : ''}`}>
            <div>
              <span className={`status ${availability}`}>{status}</span>
              {
                available ? ' to use in ' : ' at location '
              }
              <span>{item.location}</span>
              {
                item.callNumber.length ?
                (<span className="call-no"> with call no. {item.callNumber}</span>)
                : null
              }
            </div>
            <div>
              {
                item.url && item.url.length ?
                (
                  <a
                    href={item.url}
                    className="button"
                  >
                    {item.actionLabel}
                    <span className="visuallyHidden"> {item.actionLabelHelper}</span>
                  </a>
                )
                : null
              }
            </div>
          </div>
        </li>
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
        <li>
          <a
            href="#"
            className="see-more-link"
            onClick={(e) => this.showMoreItems(e)}
          >
            See {moreCount} more item{moreCount > 1 ? 's' : ''}
            <span className="visuallyHidden"> in collapsed menu for {resultTitle}</span>
          </a>
        </li>
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
      <ul
        tabIndex="0"
        className="sub-items"
        aria-label={`This bibliographical record has ${items.length}` +
          ` item${items.length > 1 ? 's' : ''}.`}
      >
        {this.getItems(items)}
        {this.getMoreLink(items)}
      </ul>
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
