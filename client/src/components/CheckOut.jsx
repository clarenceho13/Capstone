import React from 'react';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';

function CheckOut(props) {
  return (
    <Row className="checkout">
      <Col className={props.step1 ? 'active' : ''}><i className="bi bi-person-circle"></i>Sign in</Col>
      <Col className={props.step2 ? 'active' : ''}>Enter Shipping Details</Col>
      <Col className={props.step3 ? 'active' : ''}>Make Payment</Col>
      <Col className={props.step4 ? 'active' : ''}>Place Order</Col>
    </Row>
  );
}

export default CheckOut;
