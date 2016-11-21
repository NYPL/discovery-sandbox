import React from 'react';

class TabPanel extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div
        id={this.props.id}
        className={`tabpanel ${this.props.index === this.props.selected ? 'active' : ''}`}
      >
        {this.props.children}
      </div>
    );
  }
}

export default TabPanel;
