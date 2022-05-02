import { Link as DSLink } from "@nypl/design-system-react-components";
import React from "react";
import { Link } from "react-router";

const BackToSearchResults = ({ result, bibId }) => {
  return (
    result.fromUrl &&
    result.bibId === bibId && (
      <DSLink>
        <Link to={result.fromUrl}>Back to search results</Link>
      </DSLink>
    )
  );
};

export default BackToSearchResults;
