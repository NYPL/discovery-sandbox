import React from 'react';

import TabPanel from './TabPanel.jsx';

class Tabs extends React.Component {
  constructor(props) {
    super(props);

    this.state = { index: 0 };
    this.selectTab = this.selectTab.bind(this);
  }

  selectTab(i) {
    this.setState({ index: i });
  }

  getTabList(tabs) {
    return tabs.map((tab, i) => {
      return (
        <li
          key={i}
          className="tab"
          role="tab"
          aria-selected={this.state.index === i}
          aria-controls={tab.id}
          onClick={this.selectTab.bind(this, i)}
        >
          {tab.title}
        </li>
      );
    });
  }

  render() {
    const panels = React.Children.map(this.props.children, (child, i) => {
      if (child.type === TabPanel) {
        return React.cloneElement(child, {index: i, selected: this.state.index});
      }

      return null;
    });

    return (
      <div className="tabUI">
        <ul className="tabs" role="tablist">
          {this.getTabList(this.props.tabs)}
        </ul>
        {panels}
      </div>
    );
  }
}

export default Tabs;
