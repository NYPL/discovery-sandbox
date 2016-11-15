import React from 'react';
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
      <div>
        <div className="page-header">
          <div className="container">
            <Breadcrumbs
              query={searchKeywords}
              type="holdConfirmation"
              title={title}
              url={id}
            />
          </div>
        </div>

        <div className="container holds-container">
          <div className="item-header">
            <h1>Research item request confirmation</h1>
          </div>

          <div className="item-summary row">
            <div className="details col span-2-3">
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
                <li>Visit your <a href="#">patron account page</a> to view the status of this item hold</li>
              </ul>
            </div>
            <div className="actions col span-1-3">
              <h2>Available actions</h2>
              <ul className="generic-list">
                <li>Visit your <Link to="/account/holds">patron account page</Link> to view the status of this item hold</li>
                { /* <li>You may <a href="#cancel">cancel</a> this item hold at any time</li> */ }
              </ul>
            </div>
          </div>

          <div className="row map-container">
            <div className="col span-3-5">
              <Tabs
                tabs={[
                  {title: 'Directions to building', id: 'building'},
                  {title: 'Directions to room', id: 'room'},
                ]}
              >
                <TabPanel id="building">
                  <iframe src={`${location.address["map-embed-uri"]}`} height="450" frameBorder="0" style={{border: 0}} allowFullScreen></iframe>
                </TabPanel>
                <TabPanel id="room">
                  <img src="/src/client/images/floor_plan.png" alt="Floor plan of first floor of Stephen A. Schwarzman Building" />
                </TabPanel>
              </Tabs>
            </div>
            <div className="col span-2-5">
              <p>
                <a href={`${location.uri}`}>{location["full-name"]}</a><br />
                {location.address.address1}<br />
                {location.prefLabel}
              </p>
              <p>Regular hours:</p>
              <table className="generic-table">
                <tbody>
                  {
                    location.hours.map((h, i) => (
                      <tr key={i}>
                        <td>{h.day}</td>
                          {!h.closed &&
                            <td>
                              {h.open} - {h.close}
                            </td>
                          }
                          {h.closed &&
                            <td>
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
  item: React.PropTypes.object,
  location: React.PropTypes.object,
  searchKeywords: React.PropTypes.string,
};

export default HoldConfirmation;
