import React from 'react';
import { Link } from 'react-router';
import appConfig from '../../data/appConfig';

const AlphabeticalPagination = () => {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const letterButtons = alphabet.map(character => (
    <Link key={character} to={`${appConfig.baseUrl}/subject_headings?fromLabel=${character}`}>
      {character}
    </Link>
  ));

  const allButton = (
    <Link key="all" to={`${appConfig.baseUrl}/subject_headings`}>
      All
    </Link>
  );

  const numericalButton = (
    <Link key="numerical" to={`${appConfig.baseUrl}/subject_headings?fromLabel=0`}>
      0-9
    </Link>
  );

  const buttons = [allButton].concat(letterButtons);
  buttons.push(numericalButton);

  return (
    <div className="alphabeticalPagination">
      {buttons}
    </div>
  );
};

export default AlphabeticalPagination;
