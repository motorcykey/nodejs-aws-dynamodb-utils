import React, { useEffect, useState } from 'react';
import awsUtils from '../util/aws-utils';
import '../styles/modal.css';

const AuthModal = () => {
  const [mfaToken, setMFAToken] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isErrorDisplayed, setIsErrorDisplayed] = useState(false);

  const mfaInputRef = React.createRef();
  const modalRef = React.createRef();
  const invalidTokenRef = React.createRef();

  // component did mount
  useEffect(() => {
    openModal();
    mfaInputRef.current.focus();
  }, []);

  // runs when 'isLoggedIn' state value is updated
  useEffect(() => {
    if (isLoggedIn) { closeModal(); }
  }, [isLoggedIn]);

  const openModal = () => {
    modalRef.current.className = 'modal open';
  };

  const closeModal = () => {
    modalRef.current.className = 'modal';
  };

  const displayError = () => {
    invalidTokenRef.current.className = 'invalid-token-error show';
    setIsErrorDisplayed(true);
  };

  const hideError = () => {
    invalidTokenRef.current.className = 'invalid-token-error';
  };

  const handleMFAInputChange = (evt) => {
    setMFAToken(evt.target.value);

    if (isErrorDisplayed) { hideError(); }
  };

  const handleSubmitButton = () => {
    const request = awsUtils.assumeRole(mfaToken);

    request.then(
      (data) => {
        awsUtils.authenticateUser(data.Credentials);
        setIsLoggedIn(true);
      },
      (error) => {
        console.error('Authentication Error: ', error);
        displayError();
      }
    );
  };

  const handleCloseButton = () => {
    closeModal();
  };

  return(
    <div className='modal' ref={modalRef}>
      <div className='modal-content'>
        <div className='heading'>
          Enter AWS MFA Token to Access Table Data
        </div>
        <div>
          <input
            name='mfa'
            type='text'
            ref={mfaInputRef}
            value={mfaToken}
            onChange={handleMFAInputChange}
          />
        </div>
        <div className='invalid-token-error' ref={invalidTokenRef}>
          Invalid Token, please try again.
        </div>
        <div>
          <button
            className='submitButton'
            onClick={handleSubmitButton}
          >
            Submit MFA Token
          </button>
          <button
            className='closeButton'
            onClick={handleCloseButton}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
