import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { Cart } from '../Cart';

function ProtectedRoute({ children }) {
  const { state } = useContext(Cart);
  const { userInfo } = state;

  return userInfo ? children : <Navigate to="/signin" />;
}

export default ProtectedRoute;
