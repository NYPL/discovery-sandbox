/* global window */
import React from 'react';
import PropTypes from 'prop-types';

import { trackDiscovery } from '../../utils/utils';

class Tabbed extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      numberOfTabs: this.props.tabs.length,
    };
    this.clickHandler = this.clickHandler.bind(this);
    this.keyDownHandler = this.keyDownHandler.bind(this);
    this.links = [];
    this.sections = [];
  }

  // componentDidMount will set the initial tab, either 1 or the number fetched from the
  // url hash (to accommodate deep linking)
  componentDidMount() {
    let hashNumber = 1;
    const { hash } = this.props;
    if (hash) {
      const hashMatch = hash.match(/[^\d]*(\d)/);
      if (hashMatch) hashNumber = hashMatch[1];
      window.location.replace(window.location.href.replace(/#.*/, '') + hash);
      const tab = this.links[hashNumber];
      tab.focus();
    }
    this.setState({ tabNumber: hashNumber.toString() });
  }

  focusTab(newTabIndex) {
    const newTab = this.links[newTabIndex];
    newTab.focus();
  }

  // switches tabs by updating state and href
  switchTab(newTabIndex) {
    if (newTabIndex !== this.state.tabNumber) {
      const tabChoices = [
        'Availability Tab1',
        'Details Tab2',
        'Full Description Tab3',
      ];
      trackDiscovery('BibPage Tabs Switch', tabChoices[newTabIndex - 1]);
    }
    this.setState({ tabNumber: newTabIndex.toString() });
    const newTab = this.links[newTabIndex];
    window.location.replace(
      `${window.location.href.split('#')[0]}#tab${newTabIndex}`,
    );
    newTab.focus();
  }

  clickHandler(e) {
    e.preventDefault();
    const clickedTab = e.currentTarget;
    const index = clickedTab.getAttribute('data');
    this.switchTab(index);
  }

  // enables navigation with arrow keys
  keyDownHandler(e) {
    const index = parseInt(e.currentTarget.getAttribute('data'), 10);
    const getDir = () => {
      switch (e.which) {
        case 37:
          return index - 1;
        case 39:
          return index + 1;
        default:
          return null;
      }
    };
    const dir = getDir();
    if (e.which === 32) {
      e.preventDefault();
      this.clickHandler(e);
    }
    if (dir !== null) {
      e.preventDefault();
      if (dir <= this.state.numberOfTabs && dir >= 0) this.focusTab(dir);
    }
  }

  render() {
    const getTabIndex = (j) => {
      if (!this.state.tabNumber) return '0';
      if (parseInt(this.state.tabNumber, 10) === j) return null;
      return -1;
    };
    return (
      <div className='tabbed'>
        <ul role='tablist'>
          {this.props.tabs.map((tab, i) => {
            const j = i + 1;
            return (
              <li
                id={`tab${j}`}
                key={`tab${j}`}
                className={
                  parseInt(this.state.tabNumber, 10) === j ? 'activeTab' : null
                }
                role='presentation'
              >
                <a
                  href={`#tab${j}`}
                  id={`link${j}`}
                  tabIndex={getTabIndex(j)}
                  aria-selected={
                    this.state.tabNumber &&
                    j === parseInt(this.state.tabNumber, 10)
                  }
                  role='tab'
                  data={`${j}`}
                  onClick={this.clickHandler}
                  onKeyDown={this.keyDownHandler}
                  ref={(input) => {
                    this.links[`${j}`] = input;
                  }}
                >
                  {tab.title}
                </a>
              </li>
            );
          })}
          <li className='blank' role='presentation' />
          {this.props.tabs.map((tab, i) => {
            const j = i + 1;
            return (
              <section
                id={`section${j}`}
                key={`section${j}`}
                className='non-default'
                ref={(input) => {
                  this.sections[`${j}`] = input;
                }}
                aria-labelledby={`link${j}`}
              >
                {this.props.tabs[i].content}
              </section>
            );
          })}
          <section
            className='default'
            ref={(input) => {
              this.default = input;
            }}
            aria-labelledby='link1'
          >
            {this.props.tabs[0].content}
          </section>
        </ul>
      </div>
    );
  }
}

Tabbed.propTypes = {
  tabs: PropTypes.array,
  hash: PropTypes.string,
};

export default Tabbed;
