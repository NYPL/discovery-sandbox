import React from 'react';
import { trackDiscovery } from '../../utils/utils';

class Tabbed extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      numberOfTabs: this.props.tabs.length
    };
    this.clickHandler = this.clickHandler.bind(this);
    this.keyDownHandler = this.keyDownHandler.bind(this);
    this.links = [];
    this.sections = [];
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
      let hashNumber = 0;
      if (this.props.hash) {
        let hash = this.props.hash
        hashNumber = this.props.hash[3];
        window.location.href += hash; //might want to change this?
        //console.log(hash);
        //let tab = document.getElementById(`link${hash[8]}`);
        console.log(hashNumber);
        let tab = this.links[hashNumber];
        tab.focus();
      } else {
        // window.location.href += "#section0"
      }
      this.setState({tabNumber: hashNumber.toString() || '0'});
  }

  switchTab (newTabIndex) {
    trackDiscovery('Tab Switch', newTabIndex.toString());
    // const index  = parseInt(newTab.getAttribute('data'));
    this.setState({ tabNumber: newTabIndex.toString() }); //prop vs attribute
    //let newTab = document.getElementById(`link${newTabIndex}`);
    //console.log(this.links);
    let newTab = this.links[newTabIndex];
    // newTab.click();
    window.location.replace(window.location.href.split('#')[0] + `#li${newTabIndex}`);
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
    //const sectionNumber = e.currentTarget.href.split("#")[1][2];
    //const panel = document.getElementById(sectionNumber);
    //let panel = this.refs.sections[sectionNumber];
    //console.log(this.state.tabNumber)
    let panel = window.location.href.split("#")[1] ? this.sections[this.state.tabNumber] : this.default
    const index = parseInt(e.currentTarget.getAttribute('data'));
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
                <li id={`li${i}`} className={(parseInt(this.state.tabNumber) === i ? 'activeTab' : null) }><h4><a href={`#li${i}`}
                id={`link${i}`}
                 tabIndex={!this.state.tabNumber ?  '0' : parseInt(this.state.tabNumber) === i ? null : -1}
                  aria-selected={this.state.tabNumber && i === parseInt(this.state.tabNumber) ? true: false}
                  role='tab'
                  data={`${i}`}
                  onClick={this.clickHandler}
                  onKeyDown={this.keyDownHandler}
                  ref={(input) => {this.links[`${i}`] = input;}}
                  >{tab.title}</a></h4></li>
             )
          })
        }
        <li className={"blank"}>" "</li>

        {
          this.props.tabs.map((tab, i) => {
            return (
              <section id={`section${i}`}
              className={this.state.tabNumber ? 'non-default' : 'non-default'}
              tabIndex={!this.state.tabNumber ? '0' : '0'}
              ref={(input) => {this.sections[`${i}`] = input;}}
              aria-describedby={`link${i}`}
              >
              <h4 hidden>{`Currently displaying ${this.props.tabs[i].title}`}</h4>
              {this.props.tabs[i].content}
              </section>
            )
          })
        }
        <section className='default' tabIndex={!this.state.tabNumber ?  '0' : '0'}
        ref={(input) => {this.default = input;}}
        aria-describedby={'link0'}
        >
        <h4 hidden> Currently displaying Details </h4>
        {this.props.tabs[0].content}
        </section>
        </ul>
        </div>
    )
  }


}

export default Tabbed;
