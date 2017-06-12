import React from 'react';
import { Link } from 'react-router';

import Breadcrumbs from '../Breadcrumbs/Breadcrumbs.jsx';
import LibraryItem from '../../utils/item.js';

class HoldConfirmation extends React.Component {
  render() {
    const {
      item,
      searchKeywords,
    } = this.props;
    const title = item.title[0];
    const id = item['@id'].substring(4);
    const selectedItem = LibraryItem.getItem(item, this.props.params.id);
    const location = LibraryItem.getLocation(item, this.props.params.id);

    return (
      <div id="mainContent">
        <div className="page-header">
          <div className="content-wrapper">
            <Breadcrumbs
              query={searchKeywords}
              type="holdConfirmation"
              title={title}
              url={id}
            />
          </div>
        </div>

        <div className="content-wrapper">
          <div className="item-header">
            <h1>Research item request confirmation</h1>
          </div>

          <div className="item-summary row">
            <div className="details two-third">
              <h2>Item request details</h2>
              <ul className="generic-list">
                <li>Item: <Link to={`/item/${id}`}>{title}</Link></li>
                {selectedItem.shelfMark &&
                  <li>
                    Call number: {selectedItem.shelfMark[0]}
                  </li>
                }
                { /* <li>Ready for use by <strong>approximately {dateDisplay}, 9:00am</strong> at the location below</li> */ }
                <li><strong>You will receive an email notification</strong> when the item is ready for use at the location below</li>
                { /* <li>Book will be held until {dateDisplayEnd}, 5:00pm</li> */ }
              </ul>
            </div>
            <div className="actions third">
              <h2>Available actions</h2>
              <ul className="generic-list">
                <li>Visit your <a href="http://myaccount-beta.nypl.org/my-account/holds">patron account page</a> to view the status of this item hold</li>
                { /* <li>You may <a href="#cancel">cancel</a> this item hold at any time</li> */ }
              </ul>
            </div>
          </div>

          <div className="map-container">
            <div className="third">
              <p>
                <a href={`${location.uri}`}>{location['full-name']}</a><br />
                {location.address.address1}<br />
                {location.prefLabel}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

HoldConfirmation.propTypes = {
  item: React.PropTypes.object,
  location: React.PropTypes.object,
  searchKeywords: React.PropTypes.string,
  params: React.PropTypes.object,
};

export default HoldConfirmation;
