import React from 'react';

import Breadcrumbs from '../Breadcrumbs/Breadcrumbs.jsx';
import ItemHoldings from './ItemHoldings.jsx';
import ItemDetails from './ItemDetails.jsx';
import ItemEditions from './ItemEditions.jsx';
import LibraryItem from '../../utils/item.js';
import EmbeddedDocument from './EmbeddedDocument.jsx';

import { Link } from 'react-router';

class ItemPageRegular extends React.Component {
  render() {
    const record = this.props.item;
    const title = record.title[0];
    const authors = record.contributor && record.contributor.length ?
      record.contributor.map((author, i) => (<Link to={{ pathname: '/search', query: { q: `contributor:"${author}"` } }} key={i}>{author}</Link>))
      : null;
    const publisher = record.publisher && record.publisher.length ? <Link to={{ pathname: '/search', query: { q: `publisher:"${record.publisher[0]}"` } }}>{record.publisher[0]}</Link>
      : null;
    const holdings = LibraryItem.getItems(record);
    const hathiEmbedURL = record.hathiVols && record.hathiVols.length ? `//hdl.handle.net/2027/${record.hathiVols[0].volumeId}?urlappend=%3Bui=embed` : '';
    const hathiURL = record.hathiVols && record.hathiVols.length ? `https://hdl.handle.net/2027/${record.hathiVols[0].volumeId}` : '';

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

    const displayFields = [
      {label: 'Title', field: 'title'},
      {label: 'Type', field: 'type'},
      {label: 'Language', field: 'language'},
      {label: 'Date Created', field: 'createdYear'},
      {label: 'Date Published', field: 'startYear'},
      {label: 'Contributors', field: 'contributor', linkable: true},
      {label: 'Publisher', field: 'publisher', linkable: true},
      {label: 'Place of publication', field: 'placeOfPublication'},
      {label: 'Subjects', field: 'subject'},
      {label: 'Dimensions', field: 'dimensions'},
      {label: 'Issuance', field: 'issuance'},
      {label: 'Owner', field: 'owner'},
      {label: 'Location', field: 'location'},
      {label: 'Notes', field: 'note'},
      {label: 'Bnumber', field: 'idBnum'},
      {label: 'LCCN', field: 'idLcc'},
      {label: 'OCLC Number', field: 'idOclc', url: 'http://worldcat.org/oclc/{id}'},
      {label: 'OCLC Workid', field: 'idOwi', url: 'http://classify.oclc.org/classify2/ClassifyDemo?owi={id}'}
    ]

    let itemDetails = [];
    displayFields.forEach((f) => {
      // skip absent fields
      if (!record[f.field] || !record[f.field].length) return false;
      let fieldValue = record[f.field][0];

      // list of links
      if (fieldValue['@id']) {
        itemDetails.push({ term: f.label, definition: `<ul>${record[f.field].map((obj, i) => (`<li key=${i}><a href="/search?q=${encodeURIComponent(`${f.field}:"${obj['@id']}"`)}">${obj.prefLabel}</a></li>`)).join('')}</ul>` });

      // list of links
      } else if (f.linkable) {
        itemDetails.push({ term: f.label, definition: `<ul>${record[f.field].map((value, i) => (`<li key=${i}><a href="/search?q=${encodeURIComponent(`${f.field}:"${value}"`)}">${value}</a></li>`)).join('')}</ul>` });

      // list of plain text
      } else {
        itemDetails.push({ term: f.label, definition: `<ul>${record[f.field].map((value, i) => (`<li key=${i}>${value}</li>`)).join('')}</ul>` });
      }
    });

    // const citeData = [
    //   // { term: 'APA', definition: 'Hamilton, A., Madison, J., Jay, J., &amp; Shapiro, I. (2009). The Federalist papers: Alexander Hamilton, James Madison, John Jay. New Haven: Yale University Press.' },
    //   // { term: 'MLA', definition: 'Hamilton, Alexander, James Madison, John Jay, and Ian Shapiro. The Federalist Papers: Alexander Hamilton, James Madison, John Jay. New Haven: Yale University Press, 2009. Print.' },
    //   // { term: 'CHICAGO', definition: 'Hamilton, Alexander, James Madison, John Jay, and Ian Shapiro. 2009. The Federalist papers: Alexander Hamilton, James Madison, John Jay. New Haven: Yale University Press.' },
    //   // { term: 'HARVARD', definition: 'HAMILTON, A., MADISON, J., JAY, J., &amp; SHAPIRO, I. (2009). The Federalist papers: Alexander Hamilton, James Madison, John Jay. New Haven, Yale University Press.' },
    //   // { term: 'TURABIAN', definition: 'Hamilton, Alexander, James Madison, John Jay, and Ian Shapiro. The Federalist Papers: Alexander Hamilton, James Madison, John Jay. New Haven: Yale University Press, 2009.' },
    // ];

    return (
      <div id="mainContent">
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
                {publisher &&
                  <div className="description">
                  Publisher: {publisher}
                </div>}
              <div className="description">
                Year published: <Link to={{ pathname: '/search', query: {q: `date:${record.startYear}`}}}>{record.startYear}</Link>
              </div>
            </div>
          </div>

          <ItemHoldings
            path={this.props.location.search}
            holdings={holdings}
            title={`${record.numAvailable} cop${record.numAvailable === 1 ? 'y' : 'ies'} of this item ${record.numAvailable === 1 ? 'is' : 'are'} available at the following locations:`}
          />

          <EmbeddedDocument
            externalURL={hathiEmbedURL}
            embedURL={hathiURL}
            owner="Hathi Trust"
            title="View this item on this website"
          />

          <div className="item-details">
            <ItemDetails
              data={itemDetails}
              title="Item details"
            />

            {/*

            <ItemDetails data={externalData} title="External data" />

            <ItemDetails data={externalLinks} title="External links" />

            <ItemDetails data={citeData} title="Cite this book" />
          */}
          </div>

          <ItemEditions title={title} item={record} />

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
