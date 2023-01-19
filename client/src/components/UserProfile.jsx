import React, { useContext, useState, useReducer } from 'react';
import { Cart } from '../Cart';
import { Helmet } from 'react-helmet-async';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import errorMessage from './error';
import axios from 'axios';

const reducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_REQUEST':
      return { ...state, loadingUpdate: true };
    case 'UPDATE_SUCCESS':
      return { ...state, loadingUpdate: false };
    case 'UPDATE_FAIL':
      return { ...state, loadingUpdate: false };

    default:
      return state;
  }
};

function UserProfile() {
  const { state, dispatch: contextDispatch } = useContext(Cart);
  const { userInfo } = state;
  const [name, setName] = useState(userInfo.name);
  const [email, setEmail] = useState(userInfo.email);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [{ loadingUpdate }, dispatch] = useReducer(reducer, {
    loadingUpdate: false,
  });

  const submitProfile = async (e) => {
    e.preventDefault();
    try {
        const { data }= await axios.put(
            '/api/user/profile',
            {
                name,
                email,
                password,
            },
            {
               headers: {authorization: `Bearer ${userInfo.token}`}
            }
        );
        dispatch({type: 'UPDATE_SUCCESS',
    });
    contextDispatch({type: 'USER_SIGNIN', payload: data });
    localStorage.setItem('userInfo', JSON.stringify(data));
    alert('Profile Updated Successfully!');
    } catch (err) {
      dispatch({ type: 'FETCH_FAIL', });
      alert(errorMessage(err))
    }
  };

  return (
    <div>
      <Helmet>
        <title>Profile</title>
      </Helmet>
      <h1 className="my-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="35"
          height="35"
          fillRule="currentColor"
          className="bi bi-person-circle"
          viewBox="0 0 16 16">
          <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
          <path
            fill-rule="evenodd"
            d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"
          />
        </svg>
        {'    '}
        Profile
      </h1>
      <Form onSubmit={submitProfile}>
        <Form.Group className="mb-3" controlId="formBasicName">
          <Form.Label>Name</Form.Label>
          <Form.Control
            value={name}
            required
            onChange={(e) => setName(e.target.value)}></Form.Control>
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}></Form.Control>
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}></Form.Control>
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicConfirmPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={confirmPassword}
            required
            onChange={(e) => setConfirmPassword(e.target.value)}></Form.Control>
        </Form.Group>
        <div className="mb-3">
          <Button variant="primary" type="submit">
            Update Profile
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default UserProfile;

//https://react-bootstrap.github.io/forms/overview/
