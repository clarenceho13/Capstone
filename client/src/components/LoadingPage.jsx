import React from 'react';
import Spinner from 'react-bootstrap/Spinner';

function LoadingPage() {
  return (
    <Spinner animation="border" role="statux">
      <span className="visually-hidden">Loading...</span>
    </Spinner>
  );
}

export default LoadingPage;

//show spinner icon, if not, show the loading
