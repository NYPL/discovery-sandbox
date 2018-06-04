import React from 'react';

class Tabs extends React.component {
  constructor(props) {
    super(props);

    this.state = {
      tabNumber: 1
    };
  }

  render() {
    return(<div className={tabbed}>
      <h3></h3> //what goes here?
      <ul>
        {this.props.tabs.map((tab, i) => {
          return (<li>
              <a href={`#section${i}`}>{tab.title}</a>
            </li>);
        })} //these would ordinarily be separate React Components
      </ul>
      {this.props.tabs.map((tab, i) => {
        return <div id={`section${i}`}>
          {(tab.content)}
        </div>;
      })}
    </div>)
  }
}
