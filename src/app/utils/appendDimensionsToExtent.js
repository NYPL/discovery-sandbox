export const appendDimensionsToExtent = (bib) => {
    if (!bib.extent || bib.extent.length === 0 || !bib.extent[0]) return;
    
    let parts = [ bib.extent[0].replace(/\s*;\s*$/, '') ]
    if (bib.dimensions && bib.dimensions[0]) parts.push(bib.dimensions[0])
    
    return [parts.join('; ')]
  }

