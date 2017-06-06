import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';

import Breadcrumbs from '../Breadcrumbs/Breadcrumbs.jsx';
import Tabs from '../Tabs/Tabs.jsx';
import TabPanel from '../Tabs/TabPanel.jsx';
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

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July',
      'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
    const date = new Date();
    date.setDate(date.getDate() + 7);
    const day = date.getDate();
    const monthIndex = date.getMonth();
    const dateDisplay = `${monthNames[monthIndex]} ${day}`;
    date.setDate(date.getDate() + 5);
    const dateDisplayEnd = `${monthNames[date.getMonth()]} ${date.getDate()}`;

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
            <div className="two-third">
              <Tabs
                tabs={[
                  { title: 'Directions to building', id: 'building' },
                  { title: 'Directions to room', id: 'room' },
                ]}
              >
                <TabPanel id="building">
                  <iframe src={`${location.address['map-embed-uri']}`} height="450" frameBorder="0" style={{ border: 0 }} allowFullScreen title="Google Map" tabIndex="-1"></iframe>
                </TabPanel>
                <TabPanel id="room">
                  <img src="/src/client/images/floor_plan.png" alt="Floor plan of first floor of Stephen A. Schwarzman Building" />
                </TabPanel>
              </Tabs>
            </div>
            <div className="third">
              <p>
                <a href={`${location.uri}`}>{location['full-name']}</a><br />
                {location.address.address1}<br />
                {location.prefLabel}
              </p>
              <p>Regular hours:</p>
              <table>
                <caption className="visuallyHidden">Location hours</caption>
                <thead>
                  <tr>
                    <th scope="col">Day</th>
                    <th scope="col">Hours</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    location.hours.map((h, i) => (
                      <tr key={i}>
                        <td scope="col">{h.day}</td>
                        {!h.closed &&
                          <td scope="col">
                            {h.open} - {h.close}
                          </td>
                        }
                        {h.closed &&
                          <td scope="col">
                            <em>Closed</em>
                          </td>
                        }
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

HoldConfirmation.propTypes = {
  item: PropTypes.object,
  location: PropTypes.object,
  searchKeywords: PropTypes.string,
  params: PropTypes.object,
};

export default HoldConfirmation;
