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
  const [yourName, setYourName] = useState(shippingAddress.yourname || '');
  const [yourAddress, setYourAddress] = useState(shippingAddress.address || '');
  const [yourNumber, setYourNumber] = useState(shippingAddress.number || '');
  const [yourPostalCode, setYourPostalCode] = useState(shippingAddress.postalcode || '');

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
        yourname,
        address,
        number,
        postalcode,
      },
    });
    localStorage.setItem(
      'shippingAddress',
      JSON.stringify({
        yourname,
        address,
        number,
        postalcode,
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
          <Form.Group className="mb-3" controlId="yourName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              value={yourName}
              placeholder="Enter your Name"
              onChange={(e) => setYourName(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="yourNumber">
            <Form.Label>Contact Number</Form.Label>
            <Form.Control
              value={yourNumber}
              placeholder="Contact Number"
              onChange={(e) => setYourNumber(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="yourAddress">
            <Form.Label>Address</Form.Label>
            <Form.Control
              value={yourAddress}
              placeholder="Enter your Address"
              onChange={(e) => setYourAddress(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="yourPostalCode">
            <Form.Label>Postal Code</Form.Label>
            <Form.Control
              value={yourPostalCode}
              placeholder="Postal Code"
              onChange={(e) => setYourPostalCode(e.target.value)}
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
