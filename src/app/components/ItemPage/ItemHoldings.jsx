import React from 'react';

class ItemHoldings extends React.Component {
  getHeading(headings) {
    return (
      <thead>
        <tr>
          {headings.map((h, i) => (<th key={i}>{h}</th>))}
        </tr>
      </thead>
    );
  }

  getRow() {
    const holdings = [
      {
        className: '',
        available: '<span class="status available">Available</span> to use at the library',
        location: '<a href="https://www.nypl.org/locations/schwarzman">Stephen A. Schwarzman Building</a>, Milstein Division Rm 121',
        callNumber: '<a href="#IB 09-5067" class="call-no">IB 09-5067</a>',
        hold: '<a href="#" class="button">Place a hold</a>',
      },
      {
        className: '',
        available: '<span class="status available">Available</span> online',
        location: '<a href="https://www.hathitrust.org/">Hathi Trust</a>',
        callNumber: '&nbsp;',
        hold: '<a href="https://catalog.hathitrust.org/Record/006171799" class="button" target="_blank">View online</a>',
      },
      {
        className: '',
        available: '<span class="status available">Available</span> to borrow',
        location: '<a href="https://www.nypl.org/locations/58th-street">58th Street Non-Fiction</a>',
        callNumber: '<a href="#342.73 F" class="call-no">342.73 F</a>',
        hold: '<a href="#" class="button">Place a request in our circulating catalog</a>',
      },
      {
        className: 'hidden',
        available: '<span class="status">Hold placed, in transit</span>',
        location: '<a href="https://www.nypl.org/locations/schwarzman">125th Street Non-Fiction</a>',
        callNumber: '<a href="#342.7302 F " class="call-no">342.7302 F</a>',
        hold: '&nbsp;',
      },
      {
        className: 'hidden',
        available: '<span class="status">Due 10/14/2016</span>',
        location: '<a href="https://www.nypl.org/locations/58th-street">58th Street Non-Fiction</a>',
        callNumber: '<a href="#342.73 F " class="call-no">342.73 F</a>',
        hold: '&nbsp;',
      },
    ];
    return (
      <tbody>
        {
          holdings.map((h, i) => (
            <tr className={h.className} key={i}>
              <td dangerouslySetInnerHTML={this.createMarkup(h.available)}></td>
              <td dangerouslySetInnerHTML={this.createMarkup(h.location)}></td>
              <td dangerouslySetInnerHTML={this.createMarkup(h.callNumber)}></td>
              <td className="align-right" dangerouslySetInnerHTML={this.createMarkup(h.hold)}></td>
            </tr>
          ))
        }
        <tr className="more">
          <td colSpan="4">
            <a href="#see-more" className="more-link">See 2 more copies</a>
          </td>
        </tr>
      </tbody>
    );
  }

  createMarkup(html) {
    return {
      __html: html,
    };
  }

  render() {
    const headings = ['Status', 'Location', 'Call Number', ''];

    const heading = this.getHeading(headings);
    const body = this.getRow();

    return (
      <div className="item-holdings">
        <h2>2 physical copies and 1 digital version of this item is available at the following locations:</h2>
        <table className="generic-table holdings-table">
          {heading}
          {body}
        </table>
      </div>
    );
  }
}

export default ItemHoldings;
