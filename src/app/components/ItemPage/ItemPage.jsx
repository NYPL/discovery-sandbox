import React from 'react';

class ItemPage extends React.Component {
  render() {
    console.log(this.props);
    return (
      <div>
        <p>Page for a specific item.</p>
      </div>
    );
  }
}

ItemPage.propTypes = {};

export default ItemPage;
