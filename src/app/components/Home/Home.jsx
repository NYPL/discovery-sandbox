import React from 'react';

import {
  map as _map,
} from 'underscore';

class Home extends React.Component {
  constructor(props) {
    super(props);

    this.createList = this.createList.bind(this);
  }

  createList(item, i) {
    return (
      <div className="browse-box" key={i}>
        <h3>{item.title}</h3>

        <ul className="mock-list">
          <li></li>
          <li></li>
          <li></li>
          <li></li>
        </ul>
      </div>
    );
  }

  render() {
    const homepageItems = [
      { title: 'Newest items', items: [] },
      { title: 'Rare items', items: [] },
      { title: 'Popular items', items: [] },
      { title: 'Popular subjects', items: [] },
      { title: 'Most prolific authors', items: [] },
      { title: 'Historical figures', items: [] },
      { title: 'Access', items: [] },
      { title: 'Material type', items: [] },
    ];

    return (
      <div className="container">
        <hr />
        <div>
          <p>
            The New York Public Library has 8,742,283 items and 678,495 collections
            created by or about 3,412,378 people and 708,902 organizations
          </p>
          <ul>
            Research tools &amp; Resources
            <li>Tutorials</li>
            <li>Other research/discovery tools (e.g. Digital Collections,
            Archives &amp; Manuscripts, Prints/Photographs)</li>
            <li>List of databases</li>
            <li>List of collections</li>
            <li>List locations/divisions</li>
          </ul>

          {_map(homepageItems, (t, i) => this.createList(t, i))}
        </div>
      </div>
    );
  }
}

export default Home;
