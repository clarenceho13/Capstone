import React, { useContext } from 'react';
import CheckOut from './CheckOut';
import { Helmet } from 'react-helmet-async';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import { Cart } from '../Cart';
import { Link, useNavigate } from 'react-router-dom';
//import Button from 'react-bootstrap/esm/Button';
import ListGroup from 'react-bootstrap/ListGroup';

function OrderPage() {
  const { state, dispatch: contextDispatch } = useContext(Cart);
  const { cart, userInfo } = state;
  return (
    <div>
      <CheckOut step1 step2 step3 step4></CheckOut>
      <Helmet>
        <title>Order Confirmation</title>
      </Helmet>
      <h1 className="my-3">Order Details</h1>
      <Row>
        <Col md={8}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Shipping Details</Card.Title>
              <Card.Text>
                Name: {cart.shippingAddress.fullName} <br />
                Contact Number: {cart.shippingAddress.number} <br />
                Address:
                {cart.shippingAddress.address} <br />
                Postal Code:
                {cart.shippingAddress.postalCode} <br />
              </Card.Text>
              <Link to="/shipping">Edit</Link>
            </Card.Body>
            <Card className="mb-3">
              <Card.Body>
                <Card.Title>Payment</Card.Title>
                <Card.Text>Method: {cart.paymentMethod}</Card.Text>
                <Link to="/payment">Edit</Link>
              </Card.Body>
            </Card>
            <Card className="mb-3">
              <Card.Body>
                <Card.Title>Items in Cart</Card.Title>
                <ListGroup variant='flush'>
                {cart.items.map((item)=>(
                  <ListGroup.Item key={item._id}>
                  <Row className='align-items-center'>
                  <Col md={6}>
                  <img src={item.image} alt={item.name} className='img-fluid rounded img-thumbnail'>
                  </img>
                  {''}
                  <Link to={`/product/${item._id}`}>{item.name}</Link>
                  </Col>
                  <Col md={3}><span>{item.quantity}</span></Col>
                  <Col md={3}>${item.price}</Col>
                  </Row>
                  </ListGroup.Item>
                ))}
                </ListGroup>
                <Link to="/cart">Edit</Link>
              </Card.Body>
            </Card>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default OrderPage;
