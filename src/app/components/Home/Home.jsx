import React from 'react';
import { Link } from 'react-router';

import {
  map as _map,
} from 'underscore';

import Search from '../Search/Search.jsx';

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
      <div className="container item-container">

        <div className="row primary">
          <div className="col span-1-2">
            <p className="lead">The New York Public Library Research Catalog has <a href="#resources">8,742,283 items</a> and <a href="#collections">678,495 collections</a> created by or about <a href="#people">3,412,378 people</a> and <a href="#people">708,902 organizations</a>.</p>
          </div>
          <div className="col span-1-2">
            <div className="search home">

              <Search />

              <p><Link to="/advanced">Use advanced search</Link></p>
            </div>
          </div>
        </div>

        <div className="row home-secondary">
          <div className="col span-2-3 browse">
            <h2>Browse the catalog by...</h2>

            <div className="row">
              <div className="col span-1-2">
                <div className="browse-box">
                  <h3>Access method</h3>
                  <ul className="browse-list">
                    <li><a href="../search/v1a.html">At the Library</a> <span className="count">6,599,815</span></li>
                    <li><a href="../search/v1a.html">Online</a> <span className="count">2,032,792</span></li>
                  </ul>
                </div>
                <div className="browse-box">
                  <h3>Resource type</h3>
                  <ul className="browse-list">
                    <li><a href="../search/v1a.html">Book</a> <span className="count">7,229,867</span></li>
                    <li><a href="../search/v1a.html">Journal/Periodical</a> <span className="count">451,608</span></li>
                    <li><a href="../search/v1a.html">Map</a> <span className="count">184,640</span></li>
                    <li><a href="../search/v1a.html">Archive/Manuscript</a> <span className="count">28,665</span></li>
                    <li><a href="../search/v1a.html">Music recording</a> <span className="count">97,246</span></li>
                    <li><a href="#more" className="more-link">See more</a></li>
                    <li className="more"><a href="../search/v1a.html">Music score</a> <span className="count">96,103</span></li>
                    <li className="more"><a href="../search/v1a.html">Video</a> <span className="count">84,393</span></li>
                    <li className="more"><a href="../search/v1a.html">Sound recording</a> <span className="count">5,661</span></li>
                    <li className="more"><a href="../search/v1a.html">Database</a> <span className="count">2,046</span></li>
                    <li className="more"><a href="../search/v1a.html">Dataset</a> <span className="count">1,162</span></li>
                    <li className="more"><a href="../search/v1a.html">Object</a> <span className="count">245</span></li>
                  </ul>
                </div>
                <div className="browse-box">
                  <h3>Language</h3>

                  <ul className="browse-list">
                    <li><a href="../search/v1a.html">English</a> <span className="count">5,014,241</span></li>
                    <li><a href="../search/v1a.html">German</a> <span className="count">550,631</span></li>
                    <li><a href="../search/v1a.html">French</a> <span className="count">478,604</span></li>
                    <li><a href="../search/v1a.html">Spanish</a> <span className="count">434,691</span></li>
                    <li><a href="../search/v1a.html">Russian</a> <span className="count">327,317</span></li>
                    <li><a href="#more" className="more-link">See more</a></li>
                    <li className="more"><a href="../search/v1a.html">Chinese</a> <span className="count">317,804</span></li>
                    <li className="more"><a href="../search/v1a.html">Italian</a> <span className="count">204,938</span></li>
                    <li className="more"><a href="../search/v1a.html">Japanese</a> <span className="count">167,108</span></li>
                    <li className="more"><a href="../search/v1a.html">Arabic</a> <span className="count">96,347</span></li>
                    <li className="more"><a href="../search/v1a.html">Portuguese</a> <span className="count">95,504</span></li>
                    <li className="more"><a href="../search/v1a.html">Polish</a> <span className="count">92,699</span></li>
                    <li className="more"><a href="../search/v1a.html">Hebrew</a> <span className="count">73,593</span></li>
                    <li className="more"><a href="../search/v1a.html">Latin</a> <span className="count">71,894</span></li>
                  </ul>
                </div>
                <div className="browse-box">
                  <h3>Subject</h3>

                </div>
                <div className="browse-box">
                  <h3>Library</h3>

                </div>
                <div className="browse-box">
                  <h3>Database</h3>

                </div>
              </div>
              <div className="col span-1-2">
                <div className="browse-box">
                  <h3>Newest items</h3>

                  <ul className="browse-list item-list">
                    <li><img src="../img/newest1.jpg" /> <a href="#newest">Intimate empires: body, race, and gender in the modern world</a> by <a href="#">Tracey Rizzo</a></li>
                    <li><img src="../img/newest2.jpg" /> <a href="#newest">A masterclass in dramatic writing: theater, film, and television</a> by <a href="#">Melanie Gideon</a></li>
                    <li><img src="../img/newest3.jpg" /> <a href="#newest">The invention of Russia : from Gorbachev's freedom to Putin's war</a> by <a href="#">Arkady Ostrovsky</a></li>
                    <li><img src="../img/newest4.jpg" /> <a href="#newest">An imperial world at war : aspects of the British Empire's war experience, 1939-1945</a></li>
                    <li><img src="../img/newest5.jpg" /> <a href="#newest">Youth culture in Chinese-language film</a> by <a href="#">Xuelin Zhou</a></li>
                    <li><a href="#more" className="more-link">Browse all newest items</a></li>
                  </ul>
                </div>
                <div className="browse-box">
                  <h3>Rare items</h3>

                  <ul className="browse-list item-list">
                    <li><img src="../img/rare1.jpg" /> <a href="#rare">Beautiful Impressions: Anna Atkins's British Algae</a></li>
                    <li><img src="../img/rare2.jpg" /> <a href="#rare">Thomas Jefferson's Autograph Copy of the Declaration of Independence</a></li>
                    <li><img src="../img/rare3.jpg" /> <a href="#rare">"Gentlemen, Please Remove Your Hats": The Gutenberg Bible</a></li>
                    <li><img src="../img/rare4.jpg" /> <a href="#rare">The First Book Published by an African American Poet</a></li>
                    <li><img src="../img/rare5.jpg" /> <a href="#rare">Art Deco Butterflies: The Genius of E.A. Séguy</a></li>
                    <li><a href="#more" className="more-link">Browse all rare items</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="col span-1-3 resources">
            <h2>Using the catalog</h2>
            <ul className="generic-list resource-list">
              <li><a href="#">NYPL Research Catalog Introduction</a></li>
              <li><a href="#">Visualize the research catalog</a></li>
              <li><a href="#">Catalog power users: advanced search guide</a></li>
              <li><a href="#">How patrons are using the catalog</a></li>
              <li><a href="#">Explore the databases that power the catalog</a></li>
            </ul>

            <h2>Explore more resources</h2>

            <ul className="generic-list resource-list">
              <li><a href="#">Archival Materials</a></li>
              <li><a href="#">Articles and Databases</a></li>
              <li><a href="#">Digital Collections</a></li>
              <li><a href="#">Prints and Photographs Catalog</a></li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
