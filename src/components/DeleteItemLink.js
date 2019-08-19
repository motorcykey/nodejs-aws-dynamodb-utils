import React from 'react';
import PropTypes from 'prop-types';

const DeleteItemLink = props => {
  const handleConfirmation = () => {
    if (confirm('Are you sure you want to delete this item?')) {
      props.onClick(props.itemId);
    }
  };

  return (
    <a
      href='#'
      onClick={handleConfirmation}
    >
      delete
    </a>
  );
};

DeleteItemLink.propTypes = {
  itemId: PropTypes.string,
  onClick: PropTypes.func
};

export default DeleteItemLink;
