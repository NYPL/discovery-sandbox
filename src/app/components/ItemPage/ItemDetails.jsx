import React from 'react';

class ItemDetails extends React.Component {
  render() {
    return (
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
    );
  }
}

export default ItemDetails;
