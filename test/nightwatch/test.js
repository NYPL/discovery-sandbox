module.exports = {
  // Just example tests for now - test tests :)
  'Locofoco search': (browser) => {
    browser
      .url('http://dev-discovery.nypl.org/')
      .waitForElementVisible('body', 2000)
      .setValue('input#search-query', 'locofoco')
      .click('button.search-button')
      .pause(2000)
      .assert.containsText('div.results-message', 'Found 5 results with keywords "locofoco"[x] .')
      .end();
  },

  'Place a hold': (browser) => {
    browser
      .url('http://dev-discovery.nypl.org/search?q=locofoco')
      .waitForElementVisible('body', 2000)
      .setValue('input#search-query', 'locofoco')
      .click('.result-item:nth-child(2) .title')
      .pause(2000)
      .assert.containsText('h1', 'Prospect before us, or Locofoco impositions exposed. ' +
        'To the people of the United States.')
      .end();
  },
};
