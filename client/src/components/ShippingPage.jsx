import React, { useState, useContext, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Cart } from '../Cart';
import { useNavigate } from 'react-router-dom';
import CheckOut from './CheckOut';

function ShippingPage() {
  const navigate = useNavigate();
  const { state, dispatch: contextDispatch } = useContext(Cart);
  const {
    userInfo,
    cart: { shippingAddress },
  } = state;
  const [fullName, setFullName] = useState(shippingAddress.fullName || '');
  const [address, setAddress] = useState(shippingAddress.address || '');
  const [number, setNumber] = useState(shippingAddress.number || '');
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || '');

  useEffect(()=>{
    if(!userInfo){
        navigate('/signin?redirect=/shipping');
    }
  },[userInfo, navigate]);
  const submitOrder = (e) => {
    e.preventDefault();
    contextDispatch({
      type: 'SAVE_SHIPPING_ADDRESS',
      payload: {
        fullName,
        address,
        number,
        postalCode,
      },
    });
    localStorage.setItem(
      'shippingAddress',
      JSON.stringify({
        fullName,
        address,
        number,
        postalCode,
      })
    );
    navigate('/payment');
  };

  return (
    <div>
      <Helmet>
        <title>Shipping Page</title>
      </Helmet>
      <CheckOut step1 step2 ></CheckOut>
      <div className="container-sm">
        <h1 className="my-3">Shipping Address</h1>

        <Form onSubmit={submitOrder}>
          <Form.Group className="mb-3" controlId="fullName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              value={fullName}
              placeholder="Enter your Name"
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="number">
            <Form.Label>Contact Number</Form.Label>
            <Form.Control
              value={number}
              placeholder="Contact Number"
              onChange={(e) => setNumber(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="address">
            <Form.Label>Address</Form.Label>
            <Form.Control
              value={address}
              placeholder="Enter your Address"
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="postalCode">
            <Form.Label>Postal Code</Form.Label>
            <Form.Control
              value={postalCode}
              placeholder="Postal Code"
              onChange={(e) => setPostalCode(e.target.value)}
              required
            />
          </Form.Group>
          <Button variant="warning" type="submit">
            Continue to Payment
          </Button>
        </Form>
      </div>
    </div>
  );
}

export default ShippingPage;

//bootstrap spacing and margin: https://getbootstrap.com/docs/4.0/utilities/spacing/
//boostrapform: https://react-bootstrap.github.io/forms/overview/
