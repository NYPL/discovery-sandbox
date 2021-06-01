import React from 'react';

class AdvancedSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      keyword: null,
      author: null,
      title: null,
      subject: null,
      language: null,
      publicationDate: null,
      format: null,
    };
  }


  render() {
    const updateField = field => (e) => {
      e.preventDefault();
      const newState = {};
      newState[field] = e.target.value;
      this.setState(newState);
    };

    return (
      <form>
        {
          Object.keys(this.state).map(key =>
            (
              <React.Fragment>
                <label htmlFor={key}>{key}</label>
                <input id={key} onClick={updateField(key)} />
              </React.Fragment>
            ),
          )
        }
      </form>
    );
  }
}

export default AdvancedSearch;
