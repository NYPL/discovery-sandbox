import PropTypes from 'prop-types';
import React from 'react';
import LibraryItem from '../../../utils/item';

const IdentifierNode = ({ values, type }) => {
  const entities = LibraryItem.getIdentifierEntitiesByType(values, type);

  if (!Array.isArray(entities) || !(entities.length > 0)) {
    return null;
  }

  const markup = entities.map((ent) => {
    const nodes = [<span key={`${ent['@value']}`}>{ent['@value']}</span>];

    if (ent.identifierStatus) {
      nodes.push(
        <span key={`${ent['@value']}`}>
          {' '}
          <em>({ent.identifierStatus})</em>
        </span>,
      );
    }

    return nodes;
  });

  return markup.length === 1 ? (
    markup.pop()
  ) : (
    <ul>
      {markup.map((mark) => (
        <li key={mark[0].key}>{mark}</li>
      ))}
    </ul>
  );
};

IdentifierNode.propTypes = {
  values: PropTypes.array,
  type: PropTypes.string,
};

export default IdentifierNode;
