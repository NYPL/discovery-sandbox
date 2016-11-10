import React from 'react';
import { Link } from 'react-router';

import Breadcrumbs from '../Breadcrumbs/Breadcrumbs.jsx';
import Store from '../../stores/Store.js';
import PatronData from '../../stores/PatronData.js';

class HoldRequest extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: Store.getState(),
      patron: PatronData.getState(),
    };
    this.onChange = this.onChange.bind(this);
  }

  onChange() {
    this.setState({ data: Store.getState() });
  }

  render() {
    const {
      item,
      searchKeywords,
    } = this.props;
    const record = this.props.item;
    const title = record.title[0];
    const bibId = record['@id'].substring(4);
    const itemId = this.props.params.id;

    // determine item and location
    const items = record.items;
    const selectedItem = items.find((i) => {
      return i['@id'].substring(4) == itemId;
    });
    // default to SASB - RMRR
    const defaultLocation = {
      '@id': 'loc:mal',
      'prefLabel': 'SASB - Rose Main Rdg Rm 315'
    };
    let location = defaultLocation;
    if (selectedItem && selectedItem.location && selectedItem.location.length > 0) {
      location = selectedItem.location[0][0];
    }
    const isOffsite = location.prefLabel.substring(0,7) === "OFFSITE"
    if (isOffsite) {
      location = defaultLocation;
    }

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July',
      'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
    let date = new Date();
    date.setDate(date.getDate() + 7);
    const day = date.getDate();
    const monthIndex = date.getMonth();
    const dateDisplay = `${monthNames[monthIndex]} ${day}`;

    return (
      <div>
        <div className="page-header">
          <div className="container">
            <Breadcrumbs
              query={searchKeywords}
              type="hold"
              title={title}
              url={bibId}
            />
          </div>
        </div>

        <div className="container holds-container">
          <div className="item-header">
            <h1>Research item hold request</h1>
          </div>

          <div className="item-summary">
            <div className="item">
              <h2>You are about to request a hold on the following research item:</h2>
              <Link href={`/item/${bibId}`}>{title}</Link>
            </div>
          </div>

          <form className="place-hold-form form" action={`/hold/request/${itemId}`} method="POST">
            <h2>Confirm account</h2>

            <p>You are currently logged in as <strong>{this.state.patron.names[0]}</strong>. If this is not you, please <a href="https://isso.nypl.org/auth/logout">Log out</a> and sign in using your library card.</p>

            <h2>Confirm delivery location</h2>

            <p>When this item is ready, you will use it in the following location:</p>

            <fieldset className="select-location-fieldset">
              <label className="group selected" htmlFor="location1">
                <span className="col location">
                  {isOffsite &&
                    <span>
                      {location.prefLabel}
                      <br /><small>(requested from offsite storage)</small>
                    </span>
                  }
                  {!isOffsite && location.prefLabel}
                  {/*<a href="https://www.nypl.org/locations/schwarzman">Schwarzman Building</a>, 476 Fifth Avenue at 42nd, New York, NY,
                  <a href="https://www.nypl.org/locations/divisions/milstein">Milstein Division</a>, First Floor, Room 120
                  */}
                </span>
                <span className="col"><small>Call number:</small><br />{selectedItem.shelfMark[0]}</span>
                {/*<span className="col"><small>Ready by approximately:</small><br />{dateDisplay}, 9am.</span>*/}
              </label>
            </fieldset>

            <input type="hidden" name="pickupLocation" value={location['@id'].substring(4)} />

            <button type="submit" className="large">
              Submit your item hold request
            </button>
          </form>
        </div>
      </div>
    );
  }
}

HoldRequest.contextTypes = {
  router: function contextType() {
    return React.PropTypes.func.isRequired;
  },
};

HoldRequest.propTypes = {
  location: React.PropTypes.object,
  item: React.PropTypes.object,
  searchKeywords: React.PropTypes.string,
};

export default HoldRequest;
