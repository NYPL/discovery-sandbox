import React from 'react';

import Breadcrumbs from '../Breadcrumbs/Breadcrumbs.jsx';

class HoldPage extends React.Component {
  render() {
    const {
      item,
      searchKeywords,
    } = this.props;

    console.log(item);
    return (
      <div>
        <div className="page-header">
          <div className="container">
            <Breadcrumbs
              query={this.props.searchKeywords}
              type="hold"
              title={item.Record.RecordInfo.BibRecord.BibEntity.Titles[0].TitleFull}
              url={this.props.location.search}
            />
          </div>
        </div>

        <div className="container holds-container">
          <h2>Research item hold</h2>
        </div>
      </div>
    );
  }
}

export default HoldPage;
