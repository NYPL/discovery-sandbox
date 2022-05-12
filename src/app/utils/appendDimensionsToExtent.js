export const appendDimensionsToExtent = (bib) => {
  if (!bib.extent || bib.extent.length === 0) return
  let extent = bib.extent[0]
  let punctuationToAdd = ''
  // Check if extent was cataloged with a semicolon already at the end:
  const semicolon = (extent.slice(-2) === '; ' || extent.slice(-1) === ';')
  if (semicolon) {
    if (extent.slice(-1) !== ' ') punctuationToAdd += ' '
  } else punctuationToAdd = '; '
  if (bib.dimensions && bib.dimensions[0].length) {
    // If there is a dimensions field, append  it to the extent and make sure they are separated by a semicolon and a space:
    extent = extent + punctuationToAdd + bib.dimensions[0]
  } else {
    // If there is no dimensions field, remove the semicolon
    extent = punctuationToAdd.length === 0 ? extent.slice(0, -2) : extent.slice(0, -1)
  }
  return [extent]
}
