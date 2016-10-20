import React from 'react';

import Breadcrumbs from '../Breadcrumbs/Breadcrumbs.jsx';

class HoldPage extends React.Component {
  render() {
    const {
      item,
      searchKeywords,
    } = this.props;

    console.log(item);
    return (
      <div>
        <div className="page-header">
          <div className="container">
            <Breadcrumbs
              query={this.props.searchKeywords}
              type="hold"
              title={item.Record.RecordInfo.BibRecord.BibEntity.Titles[0].TitleFull}
              url={this.props.location.search}
            />
          </div>
        </div>

        <div className="container holds-container">
          <div class="item-header">
            <h1>Research item hold</h1>
          </div>

          <div className="item-summary">
            <div className="item-image">
              <img src="../img/federalist_papers.jpg" alt="The Federalist papers" />
            </div>

            <div className="item-details">
              <h2>You are about to place a hold on the following research item:</h2>
              <p><a href="../item/v1a_monograph.html">The Federalist papers : Alexander Hamilton, James Madison, John Jay / edited and with an introduction by Ian Shapiro ; with essays by John Dunn, Donald L. Horowitz, Eileen Hunt Botting.</a></p>

              <p>This is a <strong>book</strong> written in <strong>English</strong> published by <strong>New Haven: Yale University Press</strong> in <strong>2009</strong>.</p>
            </div>
          </div>

          <form className="place-hold-form form" action="/hold/confirmation">
            <h2>Confirm account</h2>

            <p>You are currently logged in as <strong>Jane Doe</strong>. If this is not you, please <a href="v1a-nouser.html">Log out</a> and sign in using your library card.</p>

            <h2>Select a location</h2>

            <p>There are <strong>2 copies</strong> of this item available for use in <strong>2 locations</strong>. Please choose where you'd like to use this item:</p>

            <fieldset className="select-location-fieldset">

              <label className="group selected" for="location1">
                <span className="col">
                  <input id="location1" type="radio" name="location" value="IB 09-5067" checked="checked" />
                </span>
                <span className="col location">
                  <a href="https://www.nypl.org/locations/schwarzman">SASB</a>, 476 Fifth Avenue at 42nd, New York, NY<br />
                  <a href="https://www.nypl.org/locations/divisions/milstein">Milstein Division</a>, First Floor, Room 121
                </span>
                <span className="col"><small>Call number:</small><br />IB 09-5067</span>
                <span className="col"><small>Ready by approximately:</small><br />Fri, Sept 2nd, 9am.</span>
              </label>
              <label className="group" for="location2">
                <span className="col">
                  <input id="location2" type="radio" name="location" value="IBC+ (Federalist) v. 1 c.2" />
                </span>
                <span className="col location">
                  Request from Princeton <a href="#help">(?)</a> for use in
                  <a href="https://www.nypl.org/locations/schwarzman">SASB</a>, 476 Fifth Avenue at 42nd, New York, NY<br />
                  <a href="https://www.nypl.org/locations/divisions/general-research-division">General Research Division</a>, Third Floor, Room 315<br />
                  Delivery to <a href="#">2 other rooms</a> allowed
                </span>
                <span className="col"><small>Call number:</small><br />IBC+ (Federalist) v. 1 c.2</span>
                <span className="col"><small>Ready by approximately:</small><br />Mon, Sept 5th, 9am.</span>
              </label>
            </fieldset>

            <button type="submit" className="large">Submit your item hold request</button>
          </form>
        </div>
      </div>
    );
  }
}

export default HoldPage;
