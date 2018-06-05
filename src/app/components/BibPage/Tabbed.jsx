import React from 'react';

class Tabbed extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tabNumber: 0
      numberOfTabs: this.props.tabs.length
    };

    this.switchTab = this.switchTab.bind(this);
    this.clickHandler = this.clickHandler.bind(this);
  }

  switchTab (newTab) {
    const index  = parseInt(newTab.getAttribute('data'));
    this.setState({ tabNumber: index }); //prop vs attribute
    newTab.focus(); //this may need to be changed because of re-rendering and synchronicity issues
  }

  clickHandler (e) {
    e.preventDefault();
    if (e.currentTarget.getAttribute('data') !== this.state.tabNumber.toString()) {
      this.switchTab(e.currentTarget);
    }
  }

  // keyDownHandler (e) {
  //   const panel = document.getElementById('panel').children[0];
  //   const index = parseInt(e.currentTarget.getAttribute('data'));
  //   let dir = e.which === 37 ? index - 1 : e.which === 39 ? index + 1 : e.which === 40 ? 'down' : null;
  //   if (dir !== null) {
  //     e.preventDefault();
  //     dir ===  'down' ? panel.focus() : dir < this.numberOfTabs ? this.switchTab(e.currentTarget)
  //   }
  // }


  render() {
    return(<div className="tabbed">
      <h3></h3>
      <ul role='tablist'>
        { this.props.tabs.map((tab, i) => {
          return (<li role='presentation'>
              <a href={`#section${i}`} tabIndex={ i === this.state.tabNumber ? null : -1 }
               aria-selected={ i === this.state.tabNumber ? true : false} role='tab' data={i} onClick={this.clickHandler}>{tab.title}</a>
            </li>);
        })}
      </ul>
      <div id="panel">
      { this.props.tabs[this.state.tabNumber].content }
      </div>
    </div>)
  }
}

// { this.props.tabItems(this.state.tabNumber)}
export default Tabbed;
