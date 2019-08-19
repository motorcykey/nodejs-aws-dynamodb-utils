import React, { useReducer } from 'react';
import PropTypes from 'prop-types';

import TableRowContext from '../context/table-row-context';
import { rowReducer, SET_ID, SET_MOST_RECENT_ID, SET_FIRST_NAME, SET_LAST_NAME } from './reducers';

const GlobalState = props => {
  const initialState = { id: 'null', mostRecentId: '', firstName: '', lastName: '' };
  const [state, dispatch] = useReducer(rowReducer, initialState);

  const setId = id => {
    dispatch({
      type: SET_ID,
      payload: id
    });
  };

  const setMostRecentId = id => {
    dispatch({
      type: SET_MOST_RECENT_ID,
      payload: id
    });
  };

  const setFirstName = name => {
    dispatch({
      type: SET_FIRST_NAME,
      payload: name
    });
  };

  const setLastName = name => {
    dispatch({
      type: SET_LAST_NAME,
      payload: name
    });
  };

  return (
    <TableRowContext.Provider value={{
      id: state.id,
      mostRecentId: state.mostRecentId,
      firstName: state.firstName,
      lastName: state.lastName,
      setId,
      setMostRecentId,
      setFirstName,
      setLastName
    }}>
      {props.children}
    </TableRowContext.Provider>
  );
};

GlobalState.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired
};

export default GlobalState;
