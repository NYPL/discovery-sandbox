import React from 'react';

class AccountHolds extends React.Component {
  render() {
    return (
      <div className="container placehold-container">
        <div className="item-header">
          <h1>Your research item holds</h1>
        </div>

        <form className="inline-form">
          <label>Search your holds</label>
          <input type="text" placeholder="Title, location, or status" />
        </form>

        <table id="holds-table" className="generic-table tablesorter">
          <thead>
            <tr>
              <th>Date requested</th>
              <th>Item</th>
              <th>Location</th>
              <th>Status</th>
              <th>ETA</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td data-value="2016-09-01">Sep 1, 2016</td>
              <td>
                <a href="#">A political register, setting forth the principles...</a><br />
                Brownlow, William Gannaway, 1805-1877<br />
                Call number: IO (1844)
              </td>
              <td>
                <a href="https://www.nypl.org/locations/schwarzman">Stephen A. Schwarzman Building</a><br />
                <a href="https://www.google.com/maps/place/New+York+Public+Library+-+Stephen+A.+Schwarzman+Building/@40.7536903,-73.9858051,17z/data=!3m1!5s0x89c259006f811e69:0xdf9c5a032104b840!4m13!1m7!3m6!1s0x89c259aa982c98b1:0x82f102a365e99b51!2s476+5th+Ave,+New+York,+NY+10018!3b1!8m2!3d40.7536863!4d-73.9836111!3m4!1s0x0:0x3b51df6e509a734c!8m2!3d40.7531821!4d-73.9822534">476 Fifth Avenue</a> at 42nd St<br />
                <a href="https://www.nypl.org/locations/divisions/milstein">Milstein Division</a>, 1st Floor, Room 121
              </td>
              <td className="centered" data-value="1">
                <span className="status requested">Requested from offsite storage</span>
              </td>
              <td data-value="2016-09-05">
                Oct 27, 2016
                <a href="#" title="For offsite materials, requests made before 2:30 PM will be delivered the following business day. Requests made after 2:30 PM on Fridays or over the weekend will be delivered the following Tuesday.">(?)</a>
              </td>
              <td>
                <a href="#" className="button">View hold</a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

export default AccountHolds;
