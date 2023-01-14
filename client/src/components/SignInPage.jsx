import React, { useState, useContext, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Helmet } from 'react-helmet-async';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Cart } from '../Cart';

function SignInPage() {
  const navigate =useNavigate();
  const { userInfo }= state;
  const { search } = useLocation();
  //const searchParams = new URLSearchParams(paramsString);
  const reDirect = new URLSearchParams(search).get('redirect');
  const redirect = reDirect ? reDirect : '/'; //bring us back to home screen if redirect not true
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { state, dispatch: contextDispatch } = useContext(Cart);

  const submitSignIn = async (e) => {
    e.preventDefault(); //prevent refresh when user sign in
    try {
      const { data } = await axios.post('api/user/signin', {
        email,
        password,
      });
      //dispatch( type of action, payload: what happens for the action)
      contextDispatch({ type: 'USER_SIGN_IN', payload: data})  //payload is to fetch the data from backend
      localStorage.setItem('userInfo',JSON.stringify(data)); //save the infomation into the browser after signin
      navigate( redirect || '/') //go to redirect, else, go to home screen
    } catch (err) {
      alert('User not found! Entered the wrong email/password?');
    }
  };

  useEffect(()=>{
    if(userInfo){
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]
  );
  return (
    <Container className="sign-in">
      <Helmet>
        <title>Please Sign in</title>
      </Helmet>
      <h1 className="my-3">Sign In</h1>
      <Form onSubmit={submitSignIn}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
          <Form.Text className="text-muted">
            We'll never share your email with anyone else.
          </Form.Text>
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <div className="mb-3">
          <Button variant="primary" type="submit">
            Sign in
          </Button>
        </div>
        <div className="mb-3">
          Are you a new Customer?{''}
          <Link to={`signup?redirect=${redirect}`}>Create an account</Link>
        </div>
      </Form>
    </Container>
  );
}

export default SignInPage;

//https://react-bootstrap.github.io/layout/grid/
//information on react-boostrap form: https://react-bootstrap.github.io/forms/overview/
// button boostrap from https://react-bootstrap.github.io/components/buttons/
//useLocation from react-router-dom https://reactrouter.com/en/main/hooks/use-location
//search params in URL : https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams
// Boiler plate for async functions:
//const variable=async(arguement)=>{
//do something
//}
