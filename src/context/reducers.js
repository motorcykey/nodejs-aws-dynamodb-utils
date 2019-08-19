export const SET_ID = 'ADD_ID';
export const SET_MOST_RECENT_ID = 'SET_MOST_RECENT_ID';
export const SET_FIRST_NAME = 'ADD_FIRST_NAME';
export const SET_LAST_NAME = 'ADD_LAST_NAME';

const setId = (id, state) => {
  if (id === '') { return; }
  return { ...state, id };
};

const setMostRecentId = (id, state) => {
  if (id === '') { return; }
  return { ...state, mostRecentId: id };
};

const setFirstName = (name, state) => {
  if (name === '') { return; }
  return { ...state, firstName: name };
};

const setLastName = (name, state) => {
  if (name === '') { return; }
  return { ...state, lastName: name };
};

export const rowReducer = (state, action) => {
  switch (action.type) {
  case SET_ID:
    return setId(action.payload, state);
  case SET_MOST_RECENT_ID:
    return setMostRecentId(action.payload, state);
  case SET_FIRST_NAME:
    return setFirstName(action.payload, state);
  case SET_LAST_NAME:
    return setLastName(action.payload, state);
  default:
    return state;
  }
};
