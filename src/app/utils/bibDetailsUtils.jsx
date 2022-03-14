import React from 'react';

const definitionItem = (value, index = 0) => {
  const link = (
    <a href={value.content} title={JSON.stringify(value.source, null, 2)}>
      {value.label}
    </a>
  );

  return (
    <div key={index}>
      {value.label ? link : value.content}
      {value.parallels ? value.parallels : null}
    </div>
  );
};

const annotatedMarcDetails = (bib) =>
  bib.annotatedMarc.bib.fields.map((field) => ({
    term: field.label,
    definition: field.values.map(definitionItem),
  }));

const combineBibDetailsData = (bibDetails, additionalData) => {
  const bibDetailsTerms = new Set(bibDetails.map((item) => item.term));
  const filteredAdditionalData = additionalData.filter(
    (item) => !bibDetailsTerms.has(item.term),
  );
  return bibDetails.concat(filteredAdditionalData);
};

export { definitionItem, annotatedMarcDetails, combineBibDetailsData };
