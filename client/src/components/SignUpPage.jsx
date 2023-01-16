import React, { useState, useContext, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Helmet } from 'react-helmet-async';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Cart } from '../Cart';
import errorMessage from './error';

function SignUpPage() {
  const navigate =useNavigate();
  
  const { search } = useLocation();
  //const searchParams = new URLSearchParams(paramsString);
  const reDirect = new URLSearchParams(search).get('redirect');
  const redirect = reDirect ? reDirect : '/'; //bring us back to home screen if redirect not true
  
  const [name, setName]=useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword]=useState('');

  const { state, dispatch: contextDispatch } = useContext(Cart);
  const { userInfo }= state; //note: put state below context to access it

  const submitSignUp = async (e) => {
    e.preventDefault(); //prevent refresh when user sign up
    if (password !== confirmPassword){
        alert('Passwords do not match!');
        return;
    }
    try {
      const { data } = await axios.post('api/user/signup', {
        name,
        email,
        password,
      });
      //dispatch( type of action, payload: what happens for the action)
      contextDispatch({ type: 'USER_SIGN_IN', payload: data})  //payload is to fetch the data from backend
      localStorage.setItem('userInfo',JSON.stringify(data)); //save the infomation into the browser after signin
      navigate( redirect || '/') //go to redirect, else, go to home screen
    } catch (err) {
      //alert('User not found! Entered the wrong email/password?');
      alert(errorMessage(err));
    }
  };

  useEffect(()=>{
    if(userInfo){
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]
  );
  return (
    <Container className="sign-up">
      <Helmet>
        <title>Create an Account</title>
      </Helmet>
      <h1 className="my-3">Sign Up</h1>
      <Form onSubmit={submitSignUp}>
      <Form.Group className="mb-3" controlId="formBasicName">
          <Form.Label>Name</Form.Label>
          <Form.Control
            placeholder="Enter name"
            required
            onChange={(e) => setName(e.target.value)}
          />
        </Form.Group>
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
        <Form.Group className="mb-3" controlId="formBasicConfirmPassword">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Confirm Password"
            required
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </Form.Group>
        <div className="mb-3">
          <Button variant="primary" type="submit">
            Sign up
          </Button>
        </div>
        <div className="mb-3">
          Already have an account?{''}
          <Link to={`/signin?redirect=${redirect}`}>Sign in</Link>
        </div>
      </Form>
    </Container>
  );
}

export default SignUpPage;