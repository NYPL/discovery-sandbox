import React from 'react';

const BibContext = React.createContext(null);

export const { Provider: BibProvider, Consumer: BibConsumer } = BibContext;
export default BibContext;
