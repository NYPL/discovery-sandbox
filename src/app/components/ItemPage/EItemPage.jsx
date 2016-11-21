import React from 'react';

import Breadcrumbs from '../Breadcrumbs/Breadcrumbs.jsx';
import ItemHoldings from './ItemHoldings.jsx';
import ItemDetails from './ItemDetails.jsx';
import ItemEditions from './ItemEditions.jsx';

import { Link } from 'react-router';

class ItemPage extends React.Component {
  render() {
    const record = this.props.item.Record;
    const ebscoLink = record.PLink;
    const bibRecord = record.RecordInfo.BibRecord;
    const title = bibRecord.BibEntity.Titles[0].TitleFull;
    const author = bibRecord.BibRelationships.HasContributorRelationships ?
      bibRecord.BibRelationships.HasContributorRelationships[0].PersonEntity.Name.NameFull
      : '';
    const language = bibRecord.BibEntity.Languages[0].Text;
    const subjects = bibRecord.BibEntity.Subjects;
    const subjectElm = subjects.map(subject => (`<a href="#">${subject.SubjectFull}</a>`)).join('');
    const numbering = bibRecord.BibRelationships.IsPartOfRelationships[0].BibEntity.Numbering;
    const dates = bibRecord.BibRelationships.IsPartOfRelationships[0].BibEntity.Dates[0];
    const holdings = [
      {
        className: '',
        available: '<span class="status available">Available</span> online',
        location: '<a href="https://www.ebsco.com/">EBSCO</a>',
        callNumber: '&nbsp;',
        hold: (<a href={ebscoLink} className="button" target="_blank">View on EBSCO</a>),
      },
      {
        className: '',
        available: '<span class="status available">Available</span> to use at the library',
        location: '<a href="https://www.nypl.org/locations/schwarzman">Stephen A. Schwarzman Building</a>, Milstein Division Rm 121',
        callNumber: '<a href="#IB 09-5067" class="call-no">IB 09-5067</a>',
        hold: (<Link to={`/hold${this.props.location.search}`} className="button">Place a hold</Link>),
      },
      // {
      //   className: '',
      //   available: '<span class="status available">Available</span> to borrow',
      //   location: '<a href="https://www.nypl.org/locations/58th-street">58th Street Non-Fiction</a>',
      //   callNumber: '<a href="#342.73 F" class="call-no">342.73 F</a>',
      //   hold: (<a href="#" className="button">Place a request in our circulating catalog</a>),
      // },
      {
        className: 'hidden',
        available: '<span class="status">Hold placed, in transit</span>',
        location: '<a href="https://www.nypl.org/locations/schwarzman">125th Street Non-Fiction</a>',
        callNumber: '<a href="#342.7302 F " class="call-no">342.7302 F</a>',
        hold: '&nbsp;',
      },
      {
        className: 'hidden',
        available: '<span class="status">Due 10/14/2016</span>',
        location: '<a href="https://www.nypl.org/locations/58th-street">58th Street Non-Fiction</a>',
        callNumber: '<a href="#342.73 F " class="call-no">342.73 F</a>',
        hold: '&nbsp;',
      },
    ];
    const externalData = [
      // { term: 'Publisher\'s summary', definition: `<ul>
      //     <li>This authoritative edition of the complete texts of the "Federalist Papers", the Articles of Confederation, the U.S. Constitution, and the Amendments to the U.S. Constitution features supporting essays in which leading scholars provide historical context and analysis. An introduction by Ian Shapiro offers an overview of the publication of the "Federalist Papers" and their importance. In three additional essays, John Dunn explores the composition of the "Federalist Papers" and the conflicting agendas of its authors; Eileen Hunt Botting explains how early advocates of women's rights, most prominently Mercy Otis Warren, Judith Sargent Murray, and Charles Brockden Brown, responded to the Federalist-Antifederalist debates; and Donald Horowitz discusses the "Federalist Papers" from the perspective of recent experiments with democracy and constitution-making around the world. These essays both illuminate the original texts and encourage active engagement with them.</li>
      //     <li>Source: <a href="#">Nielsen Book Data</a></li>
      //   </ul>`
      // },
      // { term: 'Wikipedia summary', definition: `<ul>
      //     <li>The Federalist is a collection of 85 articles and essays written by Alexander Hamilton, James Madison, and John Jay promoting the ratification of the United States Constitution.</li>
      //     <li>Source: <a href="https://en.wikipedia.org/wiki/The_Federalist_Papers">Wikipedia</a></li>
      //   </ul>`
      // },
    ];
    const externalLinks = [
      // { term: '<a href="http://billi.nypl.org/">NYPL B.I.L.L.I.</a>', definition: '<a href="http://billi.nypl.org/classmark/KF4501-4515">KF4501-4515</a>' },
      // { term: '<a href="http://worldcat.org/">Worldcat</a>', definition: '<a href="http://worldcat.org/oclc/262432319">262432319</a>' },
      // { term: '<a href="http://worldcat.org/">Worldcat</a>', definition: '<a href="http://worldcat.org/oclc/305151457">305151457</a>' },
      // { term: '<a href="http://classify.oclc.org/">OCLC Classification</a>', definition: '<a href="http://classify.oclc.org/classify2/ClassifyDemo?owi=1090692939">1090692939</a>' },
    ];
    const itemDetails = [
      { term: 'Title', definition: title },
      // { term: 'Uniform title', definition: 'Federalist.' },
      { term: 'Format', definition: 'Book' },
      { term: 'Language', definition: language },
      { term: 'Published', definition: `${dates.M}/${dates.D}/${dates.Y}` },
      // { term: 'Series', definition: '<a href="#series">Rethinking the Western tradition.</a>' },
      { term: 'Subjects', definition: `<div class="hiearchy">
          ${subjectElm}
        </div>`,
      },
      { term: 'Contributors', definition: `<ul>
          <li><a href="agent.html">${author}</a></li>
        </ul>`,
      },
      { term: 'Numbering', definition:
        numbering ? numbering.map((number) => {
          return `<span> ${number.Type}: ${number.Value}</span>`;
        }) : null,
      },
      // { term: 'Bibliography', definition: 'Includes bibliographical references and index.' },
      // { term: 'Contents', definition: `<ul>
      //     <li>Introduction: The Federalist then and now / Ian Shapiro</li>
      //     <li>The Federalist papers</li>
      //     <li>The Articles of Confederation</li>
      //     <li>The Constitution of the United States of America</li>
      //     <li>Amendments to the Constitution of the United States</li>
      //     <li>Unmanifest destiny / John Dunn</li>
      //     <li>The Federalist abroad in the world / Donal L. Horowitz</li>
      //     <li>Protofeminist responses to the Federalist-Antifederalist debate / Eileen Hunt Botting.</li>
      //   </ul>`
      // },
      // { term: 'ISBN', definition: `<ul>
      //     <li>9780300118902 (pbk.)</li>
      //     <li>0300118902 (pbk.)</li>
      //   </ul>`
      // },
      // { term: 'Research call number', definition: 'IB 09-5067' },
    ];
    const citeData = [
      // { term: 'APA', definition: 'Hamilton, A., Madison, J., Jay, J., &amp; Shapiro, I. (2009). The Federalist papers: Alexander Hamilton, James Madison, John Jay. New Haven: Yale University Press.' },
      // { term: 'MLA', definition: 'Hamilton, Alexander, James Madison, John Jay, and Ian Shapiro. The Federalist Papers: Alexander Hamilton, James Madison, John Jay. New Haven: Yale University Press, 2009. Print.' },
      // { term: 'CHICAGO', definition: 'Hamilton, Alexander, James Madison, John Jay, and Ian Shapiro. 2009. The Federalist papers: Alexander Hamilton, James Madison, John Jay. New Haven: Yale University Press.' },
      // { term: 'HARVARD', definition: 'HAMILTON, A., MADISON, J., JAY, J., &amp; SHAPIRO, I. (2009). The Federalist papers: Alexander Hamilton, James Madison, John Jay. New Haven, Yale University Press.' },
      // { term: 'TURABIAN', definition: 'Hamilton, Alexander, James Madison, John Jay, and Ian Shapiro. The Federalist Papers: Alexander Hamilton, James Madison, John Jay. New Haven: Yale University Press, 2009.' },
    ];

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
            <div className="item-info">
              <h1>{title}</h1>
              <div className="description author">
                By <a href="#">{author}</a>
              </div>
              {/*
              <div className="description">
                Edited and with an introduction by <a href="#ian-shapiro">Ian Shapiro</a>. Essays by <a href="#john-dunn">John Dunn</a>, <a href="#donald-horowitz">Donald L. Horowitz</a>, <a href="#eileen-botting">Eileen Hunt Botting</a>
              </div>
              */}
            </div>
          </div>

          <ItemHoldings path={this.props.location.search} holdings={holdings} />

          <div className="item-details">
            <ItemDetails data={itemDetails} title="Item details" />

            {/*<ItemEditions title={title} />*/}

            <ItemDetails data={externalData} title="External data" />

            <ItemDetails data={externalLinks} title="External links" />

            <ItemDetails data={citeData} title="Cite this book" />
          </div>

        </div>
      </div>
    );
  }
}

ItemPage.propTypes = {
  item: React.PropTypes.object,
  searchKeywords: React.PropTypes.string,
  location: React.PropTypes.object,
};

export default ItemPage;
