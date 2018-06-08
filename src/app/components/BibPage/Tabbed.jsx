import React from 'react';

class Tabbed extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      numberOfTabs: this.props.tabs.length
    };
    this.clickHandler = this.clickHandler.bind(this);
    this.keyDownHandler = this.keyDownHandler.bind(this);
  }

  componentDidMount () {
    if(!this.state.tabNumber){
      this.setState({ tabNumber: '0' } )}
  }

  switchTab (newTabIndex) {
    // const index  = parseInt(newTab.getAttribute('data'));
    // debugger
    this.setState({ tabNumber: newTabIndex.toString() }); //prop vs attribute
    let newTab = document.getElementById(`link${newTabIndex}`);
    newTab.focus(); //this may need to be changed because of re-rendering and synchronicity issues
  }

  clickHandler (e) {
    e.preventDefault();
    let clickedTab = e.currentTarget;
    let index = clickedTab.getAttribute('data');
    if (index !== this.state.tabNumber) {
      this.switchTab(index);
    }
  }

  keyDownHandler (e) {
    console.log('This is being hit')
    const panel = document.getElementsByClassName('activeTab')[0];
    const index = parseInt(e.currentTarget.getAttribute('data'));
    let dir = e.which === 37 ? index - 1 : e.which === 39 ? index + 1 : e.which === 40 ? 'down' : null;
    if (dir !== null) {
      e.preventDefault();
      dir ===  'down' ? panel.focus() : dir < this.state.numberOfTabs ? this.switchTab(dir) : void 0;
    }
  }


  render () {
    return(
      <div className="tabbed">
      { this.props.tabs.map((tab, i) => {
        return(
          <div id={`dummy${i}` }
          className={this.state.tabNumber ? i === parseInt(this.state.tabNumber) ? 'targeted' : 'untargeted' : i === 0 ? 'targeted' : 'untargeted'}></div>
        )
      })
    }
        <ul role='tablist'>
          { this.props.tabs.map((tab, i) => {
            return(
                <li id={`li${i}`}><a href={`#dummy${i}`}
                id={`link${i}`}
                 tabIndex={!this.state.tabNumber ? i+1 : parseInt(this.state.tabNumber) === i ? null : -1}
                  aria-selected={this.state.tabNumber && i === parseInt(this.state.tabNumber) ? true: false}
                  role='tab'
                  data={`${i}`}
                  onClick={this.clickHandler}
                  onKeyDown={this.keyDownHandler}
                  >{tab.title}</a></li>
             )
          })
        }

        </ul>
      {
        this.props.tabs.map((tab, i) => {
          return (
            <section id={`section${i}`}
            className={this.state.tabNumber ? i === parseInt(this.state.tabNumber) ? 'activeTab': 'inactiveTab' : i === 0 ? 'default' : null}
            tabIndex={!this.state.tabNumber ? this.state.numberOfTabs + i + 1 : '0'}>
            {this.props.tabs[i].content}
            </section>
          )
        })
      }
      </div>
    )
  }


}

export default Tabbed;
