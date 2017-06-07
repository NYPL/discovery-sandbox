import React from 'react';
import { Link } from 'react-router';
import axios from 'axios';
import Actions from '../../actions/Actions';

class ItemHoldings extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      expanded: false,
    };

    this.getRecord = this.getRecord.bind(this);
  }

  getRecord(e, id, path) {
    e.preventDefault();

    axios
      .get(`/api/retrieve?q=${id}`)
      .then(response => {
        console.log(response.data);
        Actions.updateBib(response.data);
        this.context.router.push(`/${path}/${id}`);
      })
      .catch(error => {
        console.log(error);
      });
  }

  getRow(holdings) {
    const holdingCount = holdings.length;
    const maxDisplay = 7;
    const moreCount = holdingCount - maxDisplay;
    const collapsed = !this.state.expanded;

    return (
      <ul>
        {
          holdings.map((h, i) => {
            let itemLink;
            let itemDisplay = null;

            if (!h.available) {
              itemLink = <span className="nypl-item-unavailable">{h.accessMessage}</span>;
            } else if (h.isElectronicResource) {
              itemLink = <a href={h.url}>View Online</a>;
            } else {
              // NOTE: This is using `this.props.bibId` but it is wrong. It should be the item ID.
              // Currently, hitting the API with items is not working.
              if (h.requestHold) {
                itemLink = h.availability === 'available' ?
                  <Link
                    className="button"
                    to={`/hold/request/${this.props.bibId}`}
                    onClick={(e) => this.getRecord(e, this.props.bibId, 'hold/request')}
                  >Request</Link> :
                  <span className="nypl-item-unavailable">Unavailable</span>;
              } else {
                itemLink = h.url && h.url.length && h.availability === 'available' ?
                  <a href={h.url}>Request</a> :
                  <span className="nypl-item-unavailable">Unavailable</span>;
              }
            }

            if (h.callNumber) {
              itemDisplay = <span dangerouslySetInnerHTML={this.createMarkup(h.callNumber)}></span>;
            } else if (h.isElectronicResource) {
              itemDisplay = <span>{h.location}</span>;
            }

            return (
              <li
                key={i}
                className={`${h.availability} ${i >= maxDisplay && collapsed ? 'collapsed' : ''}`}
              >
                <span>
                  {itemLink}
                </span>
                {itemDisplay}
              </li>
            );
          })
        }
      </ul>
    );
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
    const holdings = this.props.holdings;
    const body = this.getRow(holdings);

    return (
      <div id="item-holdings" className="nypl-item-holdings">
        <h2>{this.props.title}</h2>
        {body}
      </div>
    );
  }
}

ItemHoldings.propTypes = {
  holdings: React.PropTypes.array,
  title: React.PropTypes.string,
  bibId: React.PropTypes.string,
};

ItemHoldings.contextTypes = {
  router: function contextType() {
    return React.PropTypes.func.isRequired;
  },
};

export default ItemHoldings;
