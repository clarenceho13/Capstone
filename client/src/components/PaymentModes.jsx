import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import CheckOut from './CheckOut';
import { Helmet } from 'react-helmet-async';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Cart } from '../Cart';

function PaymentModes() {
  const navigate = useNavigate();
  const { state, dispatch: contextDispatch } = useContext(Cart);
  const {
    cart: { shippingAddress, paymentMethod },
  } = state; //initialState from context
  const [choosenPayment, setPaymentMethod] = useState(
    paymentMethod || 'PayPal' 
  );
  useEffect(() => {
    if (!shippingAddress.address) {
      navigate('/shipping');
    }
  }, [shippingAddress, navigate]);
  const submitPayment = (e) => {
    e.preventDefault();
    contextDispatch({ type: 'SAVE_PAYMENT_METHOD', payload: choosenPayment });
    localStorage.setItem('paymentMethod', choosenPayment)
      navigate('/order');
  };
  return (
    <div>
      <CheckOut step1 step2 step3></CheckOut>
      <Helmet>
        <title>Payment</title>
      </Helmet>
      <h2 className="my-3">Payment Methods</h2>
      <Form onSubmit={submitPayment}>
        <Form.Check
          type="checkbox"
          id="PayPal"
          value="PayPal"
          label="PayPal"
          checked={choosenPayment === 'PayPal'}
          onChange={(e) => setPaymentMethod(e.target.value)}></Form.Check>
        
        <Button variant="warning" type="submit">
          Confirm
        </Button>
      </Form>
    </div>
  );
}

export default PaymentModes;

//https://react-bootstrap.github.io/forms/checks-radios/ (form checkbox documentation)
