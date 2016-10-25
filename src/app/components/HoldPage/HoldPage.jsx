import React from 'react';

import Breadcrumbs from '../Breadcrumbs/Breadcrumbs.jsx';

class HoldPage extends React.Component {
  constructor(props) {
    super(props);

    this.routeHandler = this.routeHandler.bind(this);
  }

  routeHandler(e) {
    e.preventDefault();
    this.context.router.push(`/hold/confirmation${this.props.location.search}`);
  }

  render() {
    const {
      item,
      searchKeywords,
    } = this.props;
    const record = this.props.item.Record;
    const ebscoLink = record.PLink;
    const bibRecord = record.RecordInfo.BibRecord;
    const title = bibRecord.BibEntity.Titles[0].TitleFull;

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
              query={this.props.searchKeywords}
              type="hold"
              title={item.Record.RecordInfo.BibRecord.BibEntity.Titles[0].TitleFull}
              url={this.props.location.search}
            />
          </div>
        </div>

        <div className="container holds-container">
          <div className="item-header">
            <h1>Research item hold</h1>
          </div>

          <div className="item-summary">
            <div className="item">
              <h2>You are about to place a hold on the following research item:</h2>
              <p><a href={ebscoLink}>{title}</a></p>
            </div>
          </div>

          <form className="place-hold-form form" >
            <h2>Confirm account</h2>

            <p>You are currently logged in as <strong>Jane Doe</strong>. If this is not you, please <a href="v1a-nouser.html">Log out</a> and sign in using your library card.</p>

            <h2>Select a location</h2>

            <p>When this item is ready, you will use it in the following location:</p>

            <fieldset className="select-location-fieldset">
              <label className="group selected" htmlFor="location1">
                <span className="col location">
                  <a href="https://www.nypl.org/locations/schwarzman">Schwarzman Building</a>, 476 Fifth Avenue at 42nd, New York, NY,
                  <a href="https://www.nypl.org/locations/divisions/milstein">Milstein Division</a>, First Floor, Room 120
                </span>
                <span className="col"><small>Call number:</small><br />IO (1844)</span>
                <span className="col"><small>Ready by approximately:</small><br />{dateDisplay}, 9am.</span>
              </label>
            </fieldset>

            <button type="submit" className="large" onClick={this.routeHandler}>Submit your item hold request</button>
          </form>
        </div>
      </div>
    );
  }
}

HoldPage.contextTypes = {
  router: function contextType() {
    return React.PropTypes.func.isRequired;
  },
};

export default HoldPage;
