import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import TableRowContext from '../context/table-row-context';

const AddItemButton = props => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const context = useContext(TableRowContext);

  const handleInputChange = (evt) => {
    if (evt.target.name == 'firstName') {
      setFirstName(evt.target.value);
    } else {
      setLastName(evt.target.value);
    }
  };

  const handleClick = () => {
    const nextItemId = (context.mostRecentId+1).toString();

    props.onClick({
      'id': nextItemId,
      'firstName': firstName,
      'lastName': lastName
    });
  };

  return (
    <div>
      <input
        type='text'
        name='firstName'
        value={firstName}
        onChange={handleInputChange}
      />
      <input
        type='text'
        name='lastName'
        value={lastName}
        onChange={handleInputChange}
      />
      <button
        onClick={handleClick}
      >
        Add Item
      </button>
    </div>
  );
};

AddItemButton.propTypes = {
  onClick: PropTypes.func
};

export default AddItemButton;
