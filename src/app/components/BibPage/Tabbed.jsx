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

  // componentDidMount () {
  //   if(!this.state.tabNumber){
  //     let tab;
  //     if(this.props.hash){
  //       tab = document.getElementById(`link${this.props.hash[4]}`);
  //     }
  //     let tabNum = this.props.hash[4] || '0';
  //     this.setState({ tabNumber: tabNum });
  //     window.location.href = window.location.href.split("#")[0] + `#ind${tabNum}`;
  //   }
  // }

  componentDidMount () {

      if (this.props.hash) {
        let hash = this.props.hash;
        window.location.href += hash;
        console.log(hash);
        let tab = document.getElementById(`link${hash[8]}`);
        console.log(tab);
        tab.focus();
      } else {
        // window.location.href += "#section0"
      }
      this.setState({tabNumber: this.props.hash[8] || '0'});
  }

  switchTab (newTabIndex) {
    // const index  = parseInt(newTab.getAttribute('data'));
    this.setState({ tabNumber: newTabIndex.toString() }); //prop vs attribute
    let newTab = document.getElementById(`link${newTabIndex}`);
    // newTab.click();
    window.location.replace(window.location.href.split('#')[0] + `#section${newTabIndex}`);
    newTab.focus(); //this may need to be changed because of re-rendering and synchronicity issues
  }

  clickHandler (e) {
    e.preventDefault();
    let clickedTab = e.currentTarget;
    let index = clickedTab.getAttribute('data');
    // window.location.href = window.location.href.split("#")[0] + `#dummy${index}`;
    if (index !== this.state.tabNumber) {
      this.switchTab(index);
    }
  }

  keyDownHandler (e) {
    const sectionNumber = e.currentTarget.href.split("#")[1];
    const panel = document.getElementById(sectionNumber);
    const index = parseInt(e.currentTarget.getAttribute('data'));
    console.log(e.currentTarget.href);
    let dir = e.which === 37 ? index - 1 : e.which === 39 ? index + 1 : e.which === 40 ? 'down' : null;
    if (dir !== null) {
      e.preventDefault();
      dir ===  'down' ? panel.focus() : dir < this.state.numberOfTabs && 0 <= dir ? this.switchTab(dir) : void 0;
    }
  }


  render () {
    return(
      <div className="tabbed">
        <ul role='tablist'>
          { this.props.tabs.map((tab, i) => {
            return(
                <li id={`li${i}`} className={parseInt(this.state.tabNumber) === i ? 'activeTab' : null}><h4><a href={`#section${i}`}
                id={`link${i}`}
                //i+1
                 tabIndex={!this.state.tabNumber ?  '0' : parseInt(this.state.tabNumber) === i ? null : -1}
                  aria-selected={this.state.tabNumber && i === parseInt(this.state.tabNumber) ? true: false}
                  role='tab'
                  data={`${i}`}
                  onClick={this.clickHandler}
                  onKeyDown={this.keyDownHandler}
                  >{tab.title}</a></h4></li>
             )
          })
        }

        </ul>
      {
        this.props.tabs.map((tab, i) => {
          return (
            <section id={`section${i}`}
            className={this.state.tabNumber? 'non-default' : null}
            //this.state.numberOfTabs + i + 1
            tabIndex={!this.state.tabNumber ? '0' : '0'}>
            {this.props.tabs[i].content}
            </section>
          )
        })
      }
      //2*this.state.numberOfTabs + 1
      <section className='default' tabIndex={!this.state.tabNumber ?  '0' : '0'}>
        {this.props.tabs[0].content}
      </section>
      </div>
    )
  }


}

export default Tabbed;
