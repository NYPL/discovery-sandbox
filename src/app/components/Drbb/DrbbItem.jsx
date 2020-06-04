import React from 'react';

import appConfig from '@appConfig';

const DrbbItem = (props) => {
  const { work } = props;
  const {
    agents,
    title,
  } = work;

  const authorship = () => {
    const authors = agents.map((agent, i) => [(i > 0 ? ', ' : null), <a key={agent.name}>{agent.name}</a>]);

    return (
      <div>
        By {authors}
      </div>
    );
  };
  return (
    <li className="drbb-item">
      <a
        target="_blank"
        href={`${appConfig.drbbFrontEnd}work?recordType=editions&workId=${work.uuid}`}
      >
        {title}
      </a>
      {agents && agents.length ? authorship() : null}
    </li>
  );
};

export default DrbbItem;
