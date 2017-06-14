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
    const shortenItems = !this.props.shortenItems;
    const itemsToDisplay = shortenItems ? holdings.slice(0, 20) : holdings;
    const itemLength = itemsToDisplay.length;

    return (
      <table className="nypl-basic-table">
        <caption className="hidden">item holdings</caption>
        <tbody>
          {
            itemsToDisplay.map((h, i) => {
              let itemLink;
              let itemDisplay = null;

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
              }

              if (h.callNumber) {
                itemDisplay =
                  <span dangerouslySetInnerHTML={this.createMarkup(h.callNumber)}></span>;
              } else if (h.isElectronicResource) {
                itemDisplay = <span>{h.location}</span>;
              }

              return (
                <tr key={i} className={h.availability}>
                  <td>{h.location}</td>
                  <td>{itemDisplay}</td>
                  <td>{h.status}</td>
                  <td>{h.accessMessage}</td>
                  <td>{itemLink}</td>
                </tr>
              );
            })
          }
          {
            shortenItems && itemLength >= 20 &&
              (<tr>
                <td colSpan="5">
                  <Link
                    to={`/bib/${this.props.bibId}/all`}
                    className="view-all-items"
                  >
                    View All Items
                  </Link>
                </td>
              </tr>)
          }
        </tbody>
      </table>
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
  shortenItems: React.PropTypes.bool,
};

ItemHoldings.defaultProps = {
  shortenItems: false,
};

ItemHoldings.contextTypes = {
  router: function contextType() {
    return React.PropTypes.func.isRequired;
  },
};

export default ItemHoldings;
