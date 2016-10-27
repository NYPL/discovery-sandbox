import React from 'react';
import { Link } from 'react-router';

import Breadcrumbs from '../Breadcrumbs/Breadcrumbs.jsx';
import Tabs from '../Tabs/Tabs.jsx';
import TabPanel from '../Tabs/TabPanel.jsx';

class HoldConfirmation extends React.Component {
  render() {
    const {
      item,
      searchKeywords,
    } = this.props;
    const title = item.Record.RecordInfo.BibRecord.BibEntity.Titles[0].TitleFull;

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
              url={this.props.location.search}
            />
          </div>
        </div>

        <div className="container holds-container">
          <div className="item-header">
            <h1>Research item hold confirmation</h1>
          </div>

          <div className="item-summary row">
            <div className="details col span-2-3">
              <h2>Item hold details</h2>
              <ul className="generic-list">
                <li>You have placed a hold on <Link to={`/item${this.props.location.search}`}>{title}</Link> with call number <a href="#">IB 09-5067</a></li>
                <li>Ready for use by <strong>approximately {dateDisplay}, 9:00am</strong> at the location below</li>
                <li><strong>You will receive an email notification</strong> when the item is ready for use</li>
                <li>Book will be held until {dateDisplayEnd}, 5:00pm</li>
                <li>Visit your <a href="../holds/v1a.html">patron account page</a> to view the status of this item hold</li>
              </ul>
            </div>
            <div className="actions col span-1-3">
              <h2>Available actions</h2>
              <ul className="generic-list">
                <li>Visit your <Link to="/account/holds">patron account page</Link> to view the status of this item hold</li>
                <li>You may <a href="#cancel">cancel</a> this item hold at any time</li>
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
                  <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3022.3899875663374!2d-73.98487169126284!3d40.7534464793701!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x3b51df6e509a734c!2sNew+York+Public+Library+-+Stephen+A.+Schwarzman+Building!5e0!3m2!1sen!2sus!4v1476394300850" height="450" frameBorder="0" style={{border: 0}} allowFullScreen></iframe>
                </TabPanel>
                <TabPanel id="room">
                  <img src="/src/client/images/floor_plan.png" alt="Floor plan of first floor of Stephen A. Schwarzman Building" />
                </TabPanel>
              </Tabs>
            </div>
            <div className="col span-2-5">
              <p><a href="https://www.nypl.org/locations/schwarzman">Stephen A. Schwarzman Building</a><br />
              <a href="https://www.google.com/maps/place/New+York+Public+Library+-+Stephen+A.+Schwarzman+Building/@40.7536903,-73.9858051,17z/data=!3m1!5s0x89c259006f811e69:0xdf9c5a032104b840!4m13!1m7!3m6!1s0x89c259aa982c98b1:0x82f102a365e99b51!2s476+5th+Ave,+New+York,+NY+10018!3b1!8m2!3d40.7536863!4d-73.9836111!3m4!1s0x0:0x3b51df6e509a734c!8m2!3d40.7531821!4d-73.9822534">476 Fifth Avenue</a> (42nd St and Fifth Ave)<br />New York, NY 10018<br />
              <a href="https://www.nypl.org/locations/divisions/milstein">Milstein Division</a>, First Floor, Room 121</p>
              <p>Regular hours:</p>
              <table className="generic-table">
                <tbody>
                  <tr><td>Sunday</td><td>1 PM–5 PM</td></tr>
                  <tr><td>Monday</td><td>10 AM–6 PM</td></tr>
                  <tr><td>Tuesday</td><td>10 AM–8 PM</td></tr>
                  <tr><td>Wednesday</td><td>10 AM–8 PM</td></tr>
                  <tr><td>Thursday</td><td>10 AM–6 PM</td></tr>
                  <tr><td>Friday</td><td>10 AM–6 PM</td></tr>
                  <tr><td>Saturday</td><td>10 AM–6 PM</td></tr>
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
