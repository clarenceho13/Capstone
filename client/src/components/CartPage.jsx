import React, { useContext } from 'react';
import { Cart } from '../Cart';
import { Helmet } from 'react-helmet-async';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { Link, useNavigate } from 'react-router-dom';
import ListGroup from 'react-bootstrap/ListGroup';
import MessagePage from './MessagePage';
import Button from 'react-bootstrap/Button'; //might use
import Card from 'react-bootstrap/Card';
import axios from 'axios';

function CartPage() {
  const navigate = useNavigate();
  const { state, dispatch: contextDispatch } = useContext(Cart);
  const {
    cart: { items },
  } = state;
  
  //show whether the item is available or not
  const updateCart = async (item, quantity) => {
    const { data } = await axios.get(`/api/product/${item._id}`);
    if (data.stock < quantity) {
      window.alert('Product is out of stock!'); //show alert that product is out of stock once stock adde to cart is reached
      return;
    }else {
      contextDispatch({
        type: 'ADD_TO_CART',
        payload: { ...item, quantity },
      });
    }
    
  };
  //copied from product screen
  //delete from cart
  const deleteItem = (item) => {
    contextDispatch({ type: 'DELETE_FROM_CART', payload: item });
  };

  const checkOut = () => {
    navigate('/signin?redirect=/shipping'); //check if user is autheticated, if yes, direct to shipping page
  };
  return (
    <div>
      <Helmet>
        <title>Cart Page</title>
      </Helmet>
      <h1>Shopping Cart</h1>
      <Row>
        <Col md={8}>
          {items.length === 0 ? (
            <MessagePage>
              {' '}
              Cart is empty!
              <Link to="/">Home Page</Link>
            </MessagePage>
          ) : (
            <ListGroup>
              {items.map((item) => (
                <ListGroup.Item key={item._id}>
                  <Row className="align-items-center">
                    <Col md={4}>
                      <img
                        src={item.image}
                        alt={item.name}
                        className="img-fluid rounded img-thumbnail"></img>
                      {''}
                      <Link to={`/product/${item._id}`}>{item.name}</Link>
                    </Col>
                    <Col md={2}>
                      <Button
                        variant="danger"
                        onClick={() => updateCart(item, item.quantity - 1)}
                        disabled={item.quantity === 1}>
                        <i class="bi bi-dash"></i>
                      </Button>
                      {''}
                      <span>{item.quantity}</span>
                      {''}
                      <Button
                        variant="success"
                        onClick={() => updateCart(item, item.quantity + 1)}
                        disabled={item.quantity === item.stock}>
                        <i class="bi bi-plus"></i>
                      </Button>
                    </Col>
                    <Col md={3}>${item.price}</Col>
                    <Col md={2}>
                      <Button
                        variant="secondary"
                        onClick={() => deleteItem(item)}>
                        <i className="bi bi-trash"></i>
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h3>
                    Order total({items.reduce((a, c) => a + c.quantity, 0)}
                    items): $
                    {items.reduce((a, c) => a + c.price * c.quantity, 0)}
                  </h3>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className="d-grid">
                    <Button
                      type="button"
                      variant="warning"
                      onClick={checkOut}
                      disabled={items.length === 0}>
                      Proceed to Checkout
                    </Button>
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default CartPage;

//useContext to pass down from Cart.jsx
//button variants referred from https://react-bootstrap.github.io/components/buttons/
//button icons from https://icons.getbootstrap.com/
//buttons are disabled under certain conditions
//
