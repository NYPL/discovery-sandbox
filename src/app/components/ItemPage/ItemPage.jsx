import React from 'react';

import Breadcrumbs from '../Breadcrumbs/Breadcrumbs.jsx';
import ItemHoldings from './ItemHoldings.jsx';
import ItemDetails from './ItemDetails.jsx';

class Editions extends React.Component {
  render() {
    return (
      <div className="result-list">
        <div className="result-item">
          <div className="result-image">
            <img src="../img/federalist_papers_macmillan.jpg" alt="The Federalist papers" />
          </div>
          <div className="result-text">
            <a href="#federalist-papers1" className="title">The Federalist papers: edited by and with an introduction by Michael A. Genovese</a>
            <div className="description">Palgrave Macmillan <span className="divider"></span> 2009 <span className="divider"></span> 1st ed.</div>
          </div>
        </div>
        <div className="result-item">
          <div className="result-image">
            <img src="../img/federalist_papers_oxford.jpg" alt="The Federalist papers" />
          </div>
          <div className="result-text">
            <a href="#federalist-papers2" className="title">The Federalist papers: edited with an introduction and notes by Lawrance Goldman</a>
            <div className="description"> Oxford University Press <span className="divider"></span> 2008</div>
          </div>
        </div>
        <div className="result-item">
          <div className="result-image">
            <img src="../img/federalist_papers_penguin.jpg" alt="The Federalist papers" />
          </div>
          <div className="result-text">
            <a href="#federalist-papers3" className="title">The Federalist papers: with an introduction, table of contents, and index of ideas by Clinton Rossiter</a>
            <div className="description">Penguin <span className="divider"></span> 1961</div>
          </div>
        </div>
        <div className="result-item more">
          <div className="result-image">

          </div>
          <div className="result-text">
            <a href="#more">See all of the Library's 24 editions of "The Federalist papers"</a>
          </div>

        </div>
      </div>
    );
  }
}

class ExternalData extends React.Component {
  render() {
    return (
      <dl>
        <dt>Publisher's summary</dt>
        <dd>
          <ul>
            <li>This authoritative edition of the complete texts of the "Federalist Papers", the Articles of Confederation, the U.S. Constitution, and the Amendments to the U.S. Constitution features supporting essays in which leading scholars provide historical context and analysis. An introduction by Ian Shapiro offers an overview of the publication of the "Federalist Papers" and their importance. In three additional essays, John Dunn explores the composition of the "Federalist Papers" and the conflicting agendas of its authors; Eileen Hunt Botting explains how early advocates of women's rights, most prominently Mercy Otis Warren, Judith Sargent Murray, and Charles Brockden Brown, responded to the Federalist-Antifederalist debates; and Donald Horowitz discusses the "Federalist Papers" from the perspective of recent experiments with democracy and constitution-making around the world. These essays both illuminate the original texts and encourage active engagement with them.</li>
            <li>Source: <a href="#">Nielsen Book Data</a></li>
          </ul>
        </dd>

        <dt>Wikipedia summary</dt>
        <dd>
          <ul>
            <li>The Federalist is a collection of 85 articles and essays written by Alexander Hamilton, James Madison, and John Jay promoting the ratification of the United States Constitution.</li>
            <li>Source: <a href="https://en.wikipedia.org/wiki/The_Federalist_Papers">Wikipedia</a></li>
          </ul>
        </dd>
      </dl>
    );
  }
}

class ExternalLinks extends React.Component {
  render() {
    return (
      <dl>
        <dt><a href="http://billi.nypl.org/">NYPL B.I.L.L.I.</a></dt>
        <dd><a href="http://billi.nypl.org/classmark/KF4501-4515">KF4501-4515</a></dd>

        <dt><a href="http://worldcat.org/">Worldcat</a></dt>
        <dd><a href="http://worldcat.org/oclc/262432319">262432319</a></dd>

        <dt><a href="http://worldcat.org/">Worldcat</a></dt>
        <dd><a href="http://worldcat.org/oclc/305151457">305151457</a></dd>

        <dt><a href="http://classify.oclc.org/">OCLC Classification</a></dt>
        <dd><a href="http://classify.oclc.org/classify2/ClassifyDemo?owi=1090692939">1090692939</a></dd>
      </dl>
    );
  }
}

class Cite extends React.Component {
  render() {
    return (
      <dl>
        <dt>APA</dt>
        <dd>Hamilton, A., Madison, J., Jay, J., &amp; Shapiro, I. (2009). The Federalist papers: Alexander Hamilton, James Madison, John Jay. New Haven: Yale University Press.</dd>

        <dt>MLA</dt>
        <dd>Hamilton, Alexander, James Madison, John Jay, and Ian Shapiro. The Federalist Papers: Alexander Hamilton, James Madison, John Jay. New Haven: Yale University Press, 2009. Print.</dd>

        <dt>CHICAGO</dt>
        <dd>Hamilton, Alexander, James Madison, John Jay, and Ian Shapiro. 2009. The Federalist papers: Alexander Hamilton, James Madison, John Jay. New Haven: Yale University Press.</dd>

        <dt>HARVARD</dt>
        <dd>HAMILTON, A., MADISON, J., JAY, J., &amp; SHAPIRO, I. (2009). The Federalist papers: Alexander Hamilton, James Madison, John Jay. New Haven, Yale University Press.</dd>

        <dt>TURABIAN</dt>
        <dd>Hamilton, Alexander, James Madison, John Jay, and Ian Shapiro. The Federalist Papers: Alexander Hamilton, James Madison, John Jay. New Haven: Yale University Press, 2009.</dd>
      </dl>
    );
  }
}

class ItemPage extends React.Component {
  render() {
    const record = this.props.item.Record;
    const title = record.RecordInfo.BibRecord.BibEntity.Titles[0].TitleFull;
    const author = record.RecordInfo.BibRecord.BibRelationships.HasContributorRelationships[0].PersonEntity.Name.NameFull;

    return (
      <div>
        <div className="page-header">
          <div className="container">
            <Breadcrumbs
              query={this.props.searchKeywords}
              type="item"
              title={title}
            />
          </div>
        </div>

        <div className="container item-container">
          <div className="item-header">
            <div className="item-image">
              <img src="" alt="" />
            </div>
            <div className="item-info">
              <h2>{title}</h2>
              <div className="description author">
                By <a href="#">{author}</a>
              </div>
              <div className="description">
                Edited and with an introduction by <a href="#ian-shapiro">Ian Shapiro</a>. Essays by <a href="#john-dunn">John Dunn</a>, <a href="#donald-horowitz">Donald L. Horowitz</a>, <a href="#eileen-botting">Eileen Hunt Botting</a>
              </div>
              <div className="description">
                This is a <a href="#book">book</a> written in <a href="#english">English</a> published by <a href="#yale">New Haven : Yale University Press</a> in <a href="#year">2009</a>. The library has <a href="#editions">23 more editions</a> of this book.
              </div>
            </div>
          </div>

          <ItemHoldings path={this.props.location.search} />

          <div className="item-details">
            <h2>Item details</h2>
            <ItemDetails />

            <h3><a name="editions"></a>Other editions of "The Federalist papers"</h3>
            <Editions />

            <h3>External data</h3>
            <ExternalData />

            <h3>External links</h3>
            <ExternalLinks />

            <h3>Cite this book</h3>
            <Cite />
          </div>

        </div>
      </div>
    );
  }
}

ItemPage.propTypes = {
  item: React.PropTypes.object,
  searchKeywords: React.PropTypes.string,
};

export default ItemPage;
