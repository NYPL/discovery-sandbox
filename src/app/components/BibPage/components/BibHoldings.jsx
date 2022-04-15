import React from 'react';
import { useBib } from '../../../context/Bib.Provider';
import LibraryHoldings from '../LibraryHoldings';

const BibHoldings = () => {
  const { bib } = useBib();

  if (!bib || !bib.holdings) return null;

  return (
    <section style={{ marginTop: '20px' }}>
      <LibraryHoldings holdings={bib.holdings} />
    </section>
  );
};

export default BibHoldings;
