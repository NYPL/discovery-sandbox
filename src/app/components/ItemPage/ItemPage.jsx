import React from 'react';

import Breadcrumbs from '../Breadcrumbs/Breadcrumbs.jsx';

class ItemPage extends React.Component {
  render() {
    const record = this.props.item.Record;
    const title = record.RecordInfo.BibRecord.BibEntity.Titles[0].TitleFull;
    const author = record.RecordInfo.BibRecord.BibRelationships.HasContributorRelationships[0].PersonEntity.Name.NameFull;

    return (
      <div>
        <div className="page-header">
          <div className="container">
            <Breadcrumbs query={this.props.searchKeywords} type="item" />
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

          <div className="item-holdings">
            <h2>2 physical copies and 1 digital version of this item is available at the following locations:</h2>
            <table className="generic-table holdings-table">
              <tr>
                <th>Status</th>
                <th>Location</th>
                <th>Call number</th>
                <th>&nbsp;</th>
              </tr>
              <tr>
                <td><span className="status available">Available</span> to use at the library</td>
                <td><a href="https://www.nypl.org/locations/schwarzman">Stephen A. Schwarzman Building</a>, Milstein Division Rm 121</td>
                <td><a href="#IB 09-5067" className="call-no">IB 09-5067</a></td>
                <td className="align-right"><a href="#" className="button">Place a hold</a></td>
              </tr>
              <tr>
                <td><span className="status available">Available</span> online</td>
                <td><a href="https://www.hathitrust.org/">Hathi Trust</a></td>
                <td>&nbsp;</td>
                <td className="align-right"><a href="https://catalog.hathitrust.org/Record/006171799" className="button" target="_blank">View online</a></td>
              </tr>
              <tr>
                <td><span className="status available">Available</span> to borrow</td>
                <td><a href="https://www.nypl.org/locations/58th-street">58th Street Non-Fiction</a></td>
                <td><a href="#342.73 F" className="call-no">342.73 F</a></td>
                <td className="align-right"><a href="#" className="button">Place a request in our circulating catalog</a></td>
              </tr>
              <tr className="hidden">
                <td><span className="status">Hold placed, in transit</span></td>
                <td><a href="https://www.nypl.org/locations/schwarzman">125th Street Non-Fiction</a></td>
                <td><a href="#342.7302 F " className="call-no">342.7302 F </a></td>
                <td className="align-right">&nbsp;</td>
              </tr>
              <tr className="hidden">
                <td><span className="status">Due 10/14/2016</span></td>
                <td><a href="https://www.nypl.org/locations/58th-street">58th Street Non-Fiction</a></td>
                <td><a href="#342.73 F " className="call-no">342.73 F </a></td>
                <td className="align-right">&nbsp;</td>
              </tr>
              <tr className="more">
                <td colSpan="4">
                  <a href="#see-more" className="more-link">See 2 more copies</a>
                </td>
              </tr>
            </table>
          </div>

          <div className="item-details">
            <h2>Item details</h2>

            <dl>
              <dt>Title</dt>
              <dd>The Federalist papers : Alexander Hamilton, James Madison, John Jay / edited and with an introduction by Ian Shapiro ; with essays by John Dunn, Donald L. Horowitz, Eileen Hunt Botting.</dd>

              <dt>Uniform title</dt>
              <dd>Federalist.</dd>

              <dt>Format</dt>
              <dd><a href="#book">Book</a></dd>

              <dt>Language</dt>
              <dd><a href="#english">English</a></dd>

              <dt>Published</dt>
              <dd><a href="#yale">New Haven: Yale University Press</a>, <a href="#2009">2009</a>.</dd>

              <dt>Description</dt>
              <dd>xxii, 579 p. ; 21 cm.</dd>

              <dt>Series</dt>
              <dd><a href="#series">Rethinking the Western tradition.</a></dd>

              <dt>Subjects</dt>
              <dd>
                <div className="hiearchy">
                  <a href="#contitutional-history">Constitutional history</a>
                  <a href="#contitutional-history-us">United States</a>
                  <a href="#contitutional-history-us-sources">Sources</a>
                </div>
                <div className="hiearchy">
                  <a href="#contitutional-law">Constitutional law</a>
                  <a href="#contitutional-law-us">United States</a>
                </div>
              </dd>

              <dt>Contributors</dt>
              <dd>
                <ul>
                  <li><a href="agent.html">Hamilton, Alexander, 1757-1804</a></li>
                  <li><a href="#james-madison">Madison, James, 1751-1836</a></li>
                  <li><a href="#john-jay">Jay, John, 1745-1829</a></li>
                  <li><a href="#ian-shapiro">Shapiro, Ian</a></li>
                </ul>
              </dd>

              <dt>Bibliography</dt>
              <dd>Includes bibliographical references and index.</dd>

              <dt>Contents</dt>
              <dd className="contents">
                <ul>
                  <li>Introduction: The Federalist then and now / Ian Shapiro</li>
                  <li>The Federalist papers</li>
                  <li>The Articles of Confederation</li>
                  <li>The Constitution of the United States of America</li>
                  <li>Amendments to the Constitution of the United States</li>
                  <li>Unmanifest destiny / John Dunn</li>
                  <li>The Federalist abroad in the world / Donal L. Horowitz</li>
                  <li>Protofeminist responses to the Federalist-Antifederalist debate / Eileen Hunt Botting.</li>
                </ul>
              </dd>

              <dt>ISBN</dt>
              <dd>
                <ul>
                  <li>9780300118902 (pbk.)</li>
                  <li>0300118902 (pbk.)</li>
                </ul>
              </dd>

              <dt>Research call number</dt>
              <dd>IB 09-5067</dd>

            </dl>

            <h3><a name="editions"></a>Other editions of "The Federalist papers"</h3>

            <div className="result-list">
              <div className="result-item">
                <div className="result-image">
                  <img src="../img/federalist_papers_macmillan.jpg" alt="The Federalist papers"/>
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

            <h3>External data</h3>

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

            <h3>External links</h3>

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

            <h3>Cite this book</h3>

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
          </div>

        </div>
      </div>
    );
  }
}

ItemPage.propTypes = {};

export default ItemPage;
