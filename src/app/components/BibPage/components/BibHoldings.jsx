import React from 'react';
import LibraryHoldings from '../LibraryHoldings';

const BibHoldings = () => {
  const { bib } = useBib();

  if (!bib.holdings) return null;

  return (
    <section style={{ marginTop: '20px' }}>
      <LibraryHoldings holdings={bib.holdings} />
    </section>
  );
};

export default BibHoldings;
