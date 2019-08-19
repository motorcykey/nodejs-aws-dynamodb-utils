import React from 'react';
import PropTypes from 'prop-types';

const UpdateItemLink = props => {
  return (
    <a
      href='#'
      onClick={props.onClick}
    >
      update
    </a>
  );
};

UpdateItemLink.propTypes = {
  onClick: PropTypes.func
};

export default UpdateItemLink;
