import React from 'react';
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
    if (this.props.hash) {
      let hash = this.props.hash;
      hashNumber = this.props.hash.match(/[^\d]*(\d)/)[1];
      window.location.replace(window.location.href.replace(/#.*/, '') + hash);
      let tab = this.links[hashNumber];
      tab.focus();
    }
    this.setState({ tabNumber: hashNumber.toString() });
  }

  focusTab(newTabIndex) {
    let newTab = this.links[newTabIndex];
    newTab.focus();
  }

  //switches tabs by updating state and href
  switchTab(newTabIndex) {
    if (newTabIndex !== this.state.tabNumber) {
      const tabChoices = ['Details Tab1', 'Full Description Tab2'];
      trackDiscovery('BibPage Tabs Switch', tabChoices[newTabIndex - 1]);
    }
    this.setState({ tabNumber: newTabIndex.toString() });
    let newTab = this.links[newTabIndex];
    window.location.replace(window.location.href.split('#')[0] + `#tab${newTabIndex}`);
    newTab.focus();
  }

  clickHandler(e) {
    e.preventDefault();
    let clickedTab = e.currentTarget;
    let index = clickedTab.getAttribute('data');
    this.switchTab(index);
  }

  //enables navigation with arrow keys
  keyDownHandler(e) {
    let panel = window.location.href.split("#")[1] ? this.sections[this.state.tabNumber] : this.default;
    const index = parseInt(e.currentTarget.getAttribute('data'));
    let dir = e.which === 37 ? index - 1 : e.which === 39 ? index + 1 : e.which === 40 ? 'down' : null;
    if (e.which === 32) {
      e.preventDefault();
      this.clickHandler(e);
    }
    if (dir !== null) {
      e.preventDefault();
      dir === 'down' ? panel.focus() : dir <= this.state.numberOfTabs && 0 <= dir ? this.focusTab(dir) : void 0;
    }
  }


  render() {
    console.log('rendering tabbed ', this.props, this.state);
    return (
      <div className="tabbed">
        <ul role='tablist'>
          { this.props.tabs.map((tab, i) => {
            let j = i + 1;
            return (
              <li id={`tab${j}`} key={`tab${j}`} className={(parseInt(this.state.tabNumber) === j ? 'activeTab' : null) } role='presentation'>
                <a href={`#tab${j}`}
                  id={`link${j}`}
                  tabIndex={!this.state.tabNumber ?  '0' : parseInt(this.state.tabNumber) === j ? null : -1}
                  aria-selected={this.state.tabNumber && j === parseInt(this.state.tabNumber) ? true: false}
                  role='tab'
                  data={`${j}`}
                  onClick={this.clickHandler}
                  onKeyDown={this.keyDownHandler}
                  ref={(input) => {this.links[`${j}`] = input;}}
                >{tab.title}
                </a>
              </li>
             )
           })
          }
          <li className={"blank"} role='presentation'>      </li>
          {
            this.props.tabs.map((tab, i) => {
              let j = i+1;
              return (
                <section id={`section${j}`}
                  key={`section${j}`}
                  className={this.state.tabNumber ? 'non-default' : 'non-default'}
                  tabIndex={!this.state.tabNumber ? '0' : '0'}
                  ref={(input) => {this.sections[`${j}`] = input;}}
                  aria-labelledby={`link${j}`}
                >
                <br/>
                  {this.props.tabs[i].content}
                </section>
              )
            })
          }
          <section
            className='default'
            tabIndex='0'
            ref={(input) => {this.default = input;}}
            aria-labelledby={'link1'}
          >
            <br/>
            {this.props.tabs[0].content}
          </section>
        </ul>
      </div>
    );
  }
}

export default Tabbed;
