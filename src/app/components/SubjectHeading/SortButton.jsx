import React from 'react';
import PropTypes from 'prop-types';

class SortButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      direction: props.type === 'alphabetical' ? 'ASC' : 'DESC',
    };
    this.clickHandler = this.clickHandler.bind(this);
  }

  clickHandler() {

    const {
      handler,
      type,
    } = this.props;

    const {
      direction,
    } = this.state;

    const newDirection = direction === 'ASC' ? 'DESC' : 'ASC';

    console.log('clickHandling and updating', direction, newDirection, type);
    this.setState({ direction: newDirection }, () => {
      handler(type, direction);
    });
  }

  render() {
    return (
      <div className='subjectSortButton' onClick={this.clickHandler}>˄</div>
    );
  }
}

SortButton.propTypes = {
  handler: PropTypes.func,
  type: PropTypes.string,
};

export default SortButton;
