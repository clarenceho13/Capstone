import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { Cart } from '../Cart';

function AdminRoute({ children }) {
  const { state } = useContext(Cart);
  const { userInfo } = state;

  return userInfo && userInfo.admin ? children : <Navigate to="/signin" />; //if userinfo is from admin is true, else navigate to sign in page
}

export default AdminRoute;
