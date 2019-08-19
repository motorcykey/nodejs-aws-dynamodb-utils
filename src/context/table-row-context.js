import React from 'react';

export default React.createContext({
  id: '',
  firstName: '',
  lastName: '',
  mostRecentId: '',
  setId: () => {},
  setMostRecentId: () => {},
  setFirstName: () => {},
  setLastName: () => {}
});
