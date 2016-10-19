import React from 'react';

class AdvancedSearch extends React.Component {
  render() {
    return (
      <div className="container">
        <h2>Advanced Search</h2>
      </div>
    );
  }
}

AdvancedSearch.propTypes = {
  children: React.PropTypes.object,
};

export default AdvancedSearch;
