import React from 'react';

import Breadcrumbs from '../Breadcrumbs/Breadcrumbs.jsx';
import ItemHoldings from './ItemHoldings.jsx';
import ItemDetails from './ItemDetails.jsx';
import ItemEditions from './ItemEditions.jsx';

import { Link } from 'react-router';

class ItemPageRegular extends React.Component {
  render() {
    const record = this.props.item;
    // const ebscoLink = record.PLink;
    // const bibRecord = record.RecordInfo.BibRecord;
    const title = record.title[0];
    const authors = record.contributor && record.contributor.length ?
      record.contributor.map((author, i) => (<Link to={{ pathname: '/search', query: { q: `contributor:"${author}"` } }} key={i}>{author}</Link>))
      : null;
    const authorsString = record.contributor && record.contributor.length ?
      record.contributor.map((author, i) => (`<a href="/search?q=${encodeURIComponent('contributor:"'+author+'"')}" key=${i}>${author}</a>`))
      : null;
    const language = record.language[0].prefLabel;
    const subjects = record.subject ? record.subject : [];
    const subjectElm = subjects.length ?
      subjects.map((subject, i) => (<Link to={{ pathname: '/search', query: { q: `subject:"${subject.prefLabel}"` } }} key={i}>{subject.prefLabel}</Link>)).join('')
      : '';
    // const numbering = bibRecord.BibRelationships.IsPartOfRelationships[0].BibEntity.Numbering;
    // const dates = bibRecord.BibRelationships.IsPartOfRelationships[0].BibEntity.Dates[0];
    const holdings = record.items.map((item, i) => {
      const available = item.availability[0].substring(7);
      return {
        className: '',
        available: `<span class="status available">${available}</span> `,
        location: `<a href="#"> ${item.location.length ? item.location[0][0].prefLabel : null}</a>`,
        callNumber: item.idCallNum ? item.idCallNum[0] : '',
        hold: available === 'AVAILABLE' ? (<Link to={`/hold/${item['@id'].substring(4)}`} className="button">Place a hold</Link>) : null,
      }
    });
    // const externalData = [
    //   // { term: 'Publisher\'s summary', definition: `<ul>
    //   //     <li>This authoritative edition of the complete texts of the "Federalist Papers", the Articles of Confederation, the U.S. Constitution, and the Amendments to the U.S. Constitution features supporting essays in which leading scholars provide historical context and analysis. An introduction by Ian Shapiro offers an overview of the publication of the "Federalist Papers" and their importance. In three additional essays, John Dunn explores the composition of the "Federalist Papers" and the conflicting agendas of its authors; Eileen Hunt Botting explains how early advocates of women's rights, most prominently Mercy Otis Warren, Judith Sargent Murray, and Charles Brockden Brown, responded to the Federalist-Antifederalist debates; and Donald Horowitz discusses the "Federalist Papers" from the perspective of recent experiments with democracy and constitution-making around the world. These essays both illuminate the original texts and encourage active engagement with them.</li>
    //   //     <li>Source: <a href="#">Nielsen Book Data</a></li>
    //   //   </ul>`
    //   // },
    //   // { term: 'Wikipedia summary', definition: `<ul>
    //   //     <li>The Federalist is a collection of 85 articles and essays written by Alexander Hamilton, James Madison, and John Jay promoting the ratification of the United States Constitution.</li>
    //   //     <li>Source: <a href="https://en.wikipedia.org/wiki/The_Federalist_Papers">Wikipedia</a></li>
    //   //   </ul>`
    //   // },
    // ];
    // const externalLinks = [
    //   // { term: '<a href="http://billi.nypl.org/">NYPL B.I.L.L.I.</a>', definition: '<a href="http://billi.nypl.org/classmark/KF4501-4515">KF4501-4515</a>' },
    //   // { term: '<a href="http://worldcat.org/">Worldcat</a>', definition: '<a href="http://worldcat.org/oclc/262432319">262432319</a>' },
    //   // { term: '<a href="http://worldcat.org/">Worldcat</a>', definition: '<a href="http://worldcat.org/oclc/305151457">305151457</a>' },
    //   // { term: '<a href="http://classify.oclc.org/">OCLC Classification</a>', definition: '<a href="http://classify.oclc.org/classify2/ClassifyDemo?owi=1090692939">1090692939</a>' },
    // ];
    const itemDetails = [
      { term: 'Title', definition: title },
      // { term: 'Uniform title', definition: 'Federalist.' },
      { term: 'Format', definition: `<a href="/search?q=${encodeURIComponent('materialType:"'+record.type[0]['@id']+'"')}">${record.type[0].prefLabel}</a>` },
      { term: 'Language', definition: `<a href="/search?q=${encodeURIComponent('language:"'+record.language[0]['@id']+'"')}">${language}</a>` },
      { term: 'Published', definition: `<a href="/search?q=${encodeURIComponent('date:'+record.startYear)}">${record.startYear}</a>` },
      { term: 'Subjects', definition: `<div class="hiearchy">
          ${subjectElm || 'Unknown'}
        </div>`,
      },
      { term: 'Contributors', definition: `<ul>
          <li>${authorsString || 'Unknown'}</li>
        </ul>`,
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
    // const citeData = [
    //   // { term: 'APA', definition: 'Hamilton, A., Madison, J., Jay, J., &amp; Shapiro, I. (2009). The Federalist papers: Alexander Hamilton, James Madison, John Jay. New Haven: Yale University Press.' },
    //   // { term: 'MLA', definition: 'Hamilton, Alexander, James Madison, John Jay, and Ian Shapiro. The Federalist Papers: Alexander Hamilton, James Madison, John Jay. New Haven: Yale University Press, 2009. Print.' },
    //   // { term: 'CHICAGO', definition: 'Hamilton, Alexander, James Madison, John Jay, and Ian Shapiro. 2009. The Federalist papers: Alexander Hamilton, James Madison, John Jay. New Haven: Yale University Press.' },
    //   // { term: 'HARVARD', definition: 'HAMILTON, A., MADISON, J., JAY, J., &amp; SHAPIRO, I. (2009). The Federalist papers: Alexander Hamilton, James Madison, John Jay. New Haven, Yale University Press.' },
    //   // { term: 'TURABIAN', definition: 'Hamilton, Alexander, James Madison, John Jay, and Ian Shapiro. The Federalist Papers: Alexander Hamilton, James Madison, John Jay. New Haven: Yale University Press, 2009.' },
    // ];

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
                {authors &&
                  <div className="description author">
                  By {authors}
                </div>}
              <div className="description">
                <Link to={{ pathname: '/search', query: {q: `date:${record.startYear}`}}}>{record.startYear}</Link>
              </div>
            </div>
          </div>

          <ItemHoldings
            path={this.props.location.search}
            holdings={holdings}
            title={`${record.numAvailable} copies of this item are available at the following locations:`}
          />

          <div className="item-details">
            <ItemDetails
              data={itemDetails}
              title="Item details"
            />

            {/*<ItemEditions title={title} />

            <ItemDetails data={externalData} title="External data" />

            <ItemDetails data={externalLinks} title="External links" />

            <ItemDetails data={citeData} title="Cite this book" />
          */}
          </div>

        </div>
      </div>
    );
  }
}

ItemPageRegular.propTypes = {
  item: React.PropTypes.object,
  searchKeywords: React.PropTypes.string,
  location: React.PropTypes.object,
};

export default ItemPageRegular;
