import React from 'react';

class Tabbed extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tabNumber: 0,
      numberOfTabs: this.props.tabs.length
    };

    this.switchTab = this.switchTab.bind(this);
    this.clickHandler = this.clickHandler.bind(this);
    this.keyDownHandler = this.keyDownHandler.bind(this);
  }

  switchTab (newTabIndex) {
    // const index  = parseInt(newTab.getAttribute('data'));
    this.setState({ tabNumber: newTabIndex }); //prop vs attribute
    let newTab = document.getElementById(newTabIndex);
    newTab.focus(); //this may need to be changed because of re-rendering and synchronicity issues
  }

  clickHandler (e) {
    e.preventDefault();
    let clickedTab = e.currentTarget;
    let index = parseInt(clickedTab.getAttribute('data'));
    if (index !== this.state.tabNumber) {
      this.switchTab(index);
    }
  }

  keyDownHandler (e) {
    const panel = document.getElementById('panel');//.children[0];
    const index = parseInt(e.currentTarget.getAttribute('data'));
    let dir = e.which === 37 ? index - 1 : e.which === 39 ? index + 1 : e.which === 40 ? 'down' : null;
    if (dir !== null) {
      e.preventDefault();
      dir ===  'down' ? panel.focus() : dir < this.state.numberOfTabs ? this.switchTab(dir) : void 0;
    }
  }


  render() {
    return(<div className="tabbed">
      <h3></h3>
      <ul role='tablist'>
        { this.props.tabs.map((tab, i) => {
          return (<li role='presentation' key={i}>
              <a href={`#section${i}`} tabIndex={ i === this.state.tabNumber ? null : -1 }
               aria-selected={ i === this.state.tabNumber ? true : false} role='tab' data={i} id={i}
               onClick={this.clickHandler} onKeyDown={this.keyDownHandler} > {tab.title} </a>
            </li>);
        })}
      </ul>
      <section id="panel" tabIndex="0" >
      { this.props.tabs[this.state.tabNumber].content }
      </section>
    </div>)
  }
}

// { this.props.tabItems(this.state.tabNumber)}
export default Tabbed;
