import React from 'react';

const AdvancedSearch = () => {
  return (
    <div className="container">
      <div className="item-header">
        <h1>Advanced search</h1>
      </div>

      <div className="row">

        <div className="col span-2-3 advanced-container">
          <form className="advanced-form" action="searchresults.html">

            <h3>Search query builder</h3>

            <div id="advanced-query" className="advanced-query">
              <fieldset className="advanced-fieldset clonable">
                <select className="select-contains" name="contains[]">
                  <option value="1">Does contain</option>
                  <option value="0">Does not contain</option>
                </select>
                <select className="select-words" name="words[]">
                  <option value="any">any of these words</option>
                  <option value="all">all of these words</option>
                  <option value="exactly">exactly this phrase</option>
                </select>
                <input className="input-keyword" name="keyword[]" placeholder="keyword(s) or phrase" />
                <span className="divider">in</span>
                <select className="select-fields" name="fields[]">
                  <option value="all">All fields</option>
                  <option value="title">Title</option>
                  <option value="contributor">Author/Contributor</option>
                  <option value="subject">Subject</option>
                  <option value="series">Series</option>
                  <option value="call_number">Call number</option>
                </select>
              </fieldset>
            </div>

            <p>
              Add a row: <a href="#advanced-query" className="add-row" data-heading="And">And</a>, <a href="#advanced-query" className="add-row" data-heading="Or">Or</a>
            </p>

            <h3>Limit results by</h3>
            <div className="advanced-filters">
              <fieldset>
                <label htmlFor="select-access">Access</label>
                <select id="select-access" name="access">
                  <option value="All">All</option>
                  <option value="Item">At the library</option>
                  <option value="Component">Online</option>
                  <option value="Collection">On order</option>
                </select>
              </fieldset>
              <fieldset>
                <label htmlFor="select-status">Status</label>
                <select id="select-status" name="status">
                  <option value="All">All</option>
                  <option value="Item">Available</option>
                  <option value="Component">Not available</option>
                </select>
              </fieldset>
              <fieldset>
                <label htmlFor="select-resource">Resource Type</label>
                <select id="select-resource" name="resource-type">
                  <option value="All">All</option>
                  <option value="Item">Book</option>
                  <option value="Component">Archive/Manuscript</option>
                  <option value="Collection">Journal/Periodical</option>
                </select>
              </fieldset>
              <fieldset>
                <label htmlFor="select-media">Media Type</label>
                <select id="select-media" name="media-type">
                  <option value="All">All</option>
                  <option value="Item">Microfilm</option>
                  <option value="Component">DVD</option>
                  <option value="Collection">Audiocassette</option>
                </select>
              </fieldset>
              <fieldset>
                <label htmlFor="select-language">Language</label>
                <select id="select-language" name="language">
                  <option value="all">All</option>
                  <option value="English">English</option>
                  <option value="German">German</option>
                  <option value="French">French</option>
                  <option value="No linguistic content">No linguistic content</option>
                  <option value="Spanish">Spanish</option>
                  <option value="Portuguese">Portuguese</option>
                  <option value="Italian">Italian</option>
                  <option value="Russian">Russian</option>
                  <option value="Latin">Latin</option>
                </select>
              </fieldset>
              <fieldset>
                <label htmlFor="select-subject">Subject</label>
                <select id="select-subject" name="subject">
                  <option value="all">All</option>
                  <option value="Biography">Biography</option>
                  <option value="History">History</option>
                  <option value="United States">United States</option>
                  <option value="New York (State)">New York (State)</option>
                  <option value="Fiction">Fiction</option>
                  <option value="Hamilton, Alexander, 1757-1804">Hamilton, Alexander, 1757-1804</option>
                  <option value="Politics and government">Politics and government</option>
                  <option value="Early works to 1800">Early works to 1800.</option>
                  <option value="Great Britain">Great Britain</option>
                  <option value="Electronic books">Electronic books</option>
                </select>
              </fieldset>
              <fieldset>
                <label htmlFor="select-location">Location</label>
                <select id="select-location" name="location">
                  <option value="all">All</option>
                  <option value="Stephen A. Schwarzman Building">Stephen A. Schwarzman Building</option>
                  <option value="Manuscripts and Archives Division">Manuscripts and Archives Division</option>
                  <option value="General Research Division">General Research Division</option>
                  <option value="Billy Rose Theatre Division">Billy Rose Theatre Division</option>
                  <option value="Irma and Paul Milstein Division of United States History, Local History and Genealogy">Irma and Paul Milstein Division of United States History, Local History and Genealogy</option>
                  <option value="The Miriam and Ira D. Wallach Division of Art, Prints and Photographs: Photography Collection">The Miriam and Ira D. Wallach Division of Art, Prints and Photographs: Photography Collection</option>
                  <option value="Music Division">Music Division</option>
                  <option value="The Miriam and Ira D. Wallach Division of Art, Prints and Photographs: Print Collection">The Miriam and Ira D. Wallach Division of Art, Prints and Photographs: Print Collection</option>
                  <option value="The Miriam and Ira D. Wallach Division of Art, Prints and Photographs: Art & Architecture Collection">The Miriam and Ira D. Wallach Division of Art, Prints and Photographs: Art &amp; Architecture Collection</option>
                  <option value="Jerome Robbins Dance Division">Jerome Robbins Dance Division</option>
                </select>
              </fieldset>
              <fieldset>
                <label htmlFor="input-date-end">After Year</label>
                <input id="input-date-start" name="date-start" type="number" value="1750" size="9" />
              </fieldset>
              <fieldset>
                <label htmlFor="select-date-end">Before Year</label>
                <input id="select-date-end" name="date-end" type="number" value="2016" size="9" />
              </fieldset>
            </div>

            <h3>Sort results by</h3>

            <div id="advanced-sort" className="advanced-sort">
              <fieldset className="advanced-fieldset clonable">
                <select name="sort">
                  <option value="relevance">Relevance</option>
                  <option value="title_desc">Title</option>
                  <option value="author_asc">Author</option>
                  <option value="date_asc">Date published</option>
                  <option value="date_asc">Date aquired by library</option>
                  <option value="date_asc">Call number</option>
                </select>
                <select name="asc">
                  <option value="1">Ascending</option>
                  <option value="0">Descending</option>
                </select>
              </fieldset>
            </div>

            <p>
              <a href="#advanced-sort" className="add-row" data-heading="Then sort by">Then sort similar results again by..</a>
            </p>

            <button type="submit" className="large">Submit</button>

          </form>
        </div>
        <div className="col span-1-3">
          <div className="guide">
            <h2>Search guide</h2>
            <ul className="guide-list">
              <li><strong>Add rows</strong> to combine keyword queries and limit to find specific items.</li>
              <li>Use &quot;*&quot; to search a <strong>truncated</strong> term. Word-stemming is done automatically.</li>
              <li>Use &quot;?&quot; as a <strong>wildcard</strong> to replace a character in a word.</li>
              <li><strong>Word-stemming</strong> automatically includes plural and singular forms, and common suffix and tense variations.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

AdvancedSearch.propTypes = {
  children: React.PropTypes.object,
};

export default AdvancedSearch;
