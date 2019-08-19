import React from 'react';
import TableDisplay from './TableDisplay';
import AuthModal from './AuthModal';

import GlobalState from '../context/GlobalState';

import '../styles/styles.css';

const App = () => {
  return (
    <GlobalState>
      <AuthModal />
      <h1>AWS SDK - DynamoDB Tests</h1>
      <TableDisplay />
    </GlobalState>
  );
};

export default App;
