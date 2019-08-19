import React, { useState } from 'react';
import PropTypes from 'prop-types';

const ReadItemButton = props => {
  const [id, setId] = useState('');

  const handleChange = (evt) => {
    setId(evt.target.value);
  };

  const handleClick = () => {
    props.onClick(id);
  };

  return (
    <div>
      <input
        type='text'
        value={id}
        onChange={handleChange}
      />
      <button
        onClick={handleClick}
      >
        Get Item By Id
      </button>
    </div>
  );
};

ReadItemButton.propTypes = {
  onClick: PropTypes.func
};

export default ReadItemButton;
