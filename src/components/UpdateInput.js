import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import TableRowContext from '../context/table-row-context';

const UpdateInput = props => {
  const context = useContext(TableRowContext);

  const handleInputChange = (evt) => {
    if (props.fieldName == 'firstName') {
      context.setFirstName(evt.target.value);
    } else {
      context.setLastName(evt.target.value);
    }
  };

  return (
    <input
      type='text'
      name={`${props.fieldName}`}
      onChange={handleInputChange}
      value={props.fieldName == 'firstName' ? context.firstName : context.lastName}
    />
  );
};

UpdateInput.propTypes = {
  fieldName: PropTypes.string,
  defaultValue: PropTypes.string
};

export default UpdateInput;
