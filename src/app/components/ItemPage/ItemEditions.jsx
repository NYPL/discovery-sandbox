import React from 'react';

class ItemEditions extends React.Component {
  createMarkup(markup) {
    return { __html: markup };
  }

  getImage(url) {
    if (!url) {
      return null;
    }

    return (
      <div className="result-image">
        <img src={url} alt="" />
      </div>
    );
  }

  getItem(data) {
    if (!data.length) {
      return null;
    }

    return data.map((item, i) => {
      return (
        <div className="result-item" key={i}>
          {this.getImage(item.imgUrl)}
          <div className="result-text">
            <a href="#" className="title">{item.title}</a>
            <div className="description" dangerouslySetInnerHTML={this.createMarkup(item.description)}></div>
          </div>
        </div>
      );
    });
  }

  render() {
    const data = [
      {
        imgUrl: '../img/federalist_papers_macmillan.jpg',
        title: 'The Federalist papers: edited by and with an introduction by Michael A. Genovese',
        description: '<span>Palgrave Macmillan <span class="divider"></span> 2009 <span class="divider"></span> 1st ed.</span>',
      },
      {
        imgUrl: '../img/federalist_papers_oxford.jpg',
        title: 'The Federalist papers: edited with an introduction and notes by Lawrance Goldman',
        description: '<span>Oxford University Press <span class="divider"></span> 2008</span>',
      },
      {
        imgUrl: '../img/federalist_papers_penguin.jpg',
        title: 'The Federalist papers: with an introduction, table of contents, and index of ideas by Clinton Rossiter',
        description: '<span>Penguin <span class="divider"></span> 1961</span>',
      },
    ];
    const title = this.props.title;

    return (
      <div>
        <h3>
          <a name="editions"></a>Other editions of "{title}"
        </h3>

        <div className="result-list">
          {this.getItem(data)}

          <div className="result-item more">
            <div className="result-image">

            </div>
            <div className="result-text">
              <a href="#more">See all of the Library's 24 editions of "{title}"</a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ItemEditions;
