import React, { useReducer, useContext, useEffect } from 'react';
import { Cart } from '../Cart';
import errorMessage from './error';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import LoadingPage from './LoadingPage';
import MessagePage from './MessagePage';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        users: action.payload,
        loading: false,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function UserList() {
    const navigate= useNavigate();
  const [{ loading, error, users }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
  });
  const { state } = useContext(Cart);
  const { userInfo } = state;


  useEffect(() => {
    const fetchData = async () => {
        try {
          dispatch({ type: 'FETCH_REQUEST' });
          const { data } = await axios.get(`/api/user/`, {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          });
          dispatch({ type: 'FETCH_SUCCESS', payload: data });
        } catch (err) {
          dispatch({
            type: 'FETCH_FAIL',
            payload: errorMessage(err),
          });
        }
      };
      fetchData();
  }, [userInfo]);

  return (
    <div>
      <Helmet>
        <title>Users</title>
      </Helmet>
      <h1>Users</h1>
      {loading ? (
        <LoadingPage />
      ) : error ? (
        <MessagePage variant="danger">{error}</MessagePage>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>EMAIL</th>
             
              <th>IS ADMIN</th>
              <th>ACTIONS</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.admin ? 'Yes' : 'No'}</td>
                <td>
                <Button
                type="button"
                variant="light"
                onClick={() => {
                  navigate(`/admin/user/${user._id}`);
                }}>
                Edit
              </Button>
                
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default UserList;
