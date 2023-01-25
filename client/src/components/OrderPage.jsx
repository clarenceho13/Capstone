import React, { useContext, useEffect, useReducer } from 'react';
import axios from 'axios';
import CheckOut from './CheckOut';
import { Helmet } from 'react-helmet-async';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import { Cart } from '../Cart';
import errorMessage from '../components/error';
import { Link, useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import LoadingPage from './LoadingPage';

const reducer = (state, action) => {
  switch (action.type) {
    case 'CREATE_REQUEST':
      return { ...state, loading: true };
    case 'CREATE_SUCCESS':
      return { ...state, loading: false };
    case 'CREATE_FAIL':
      return { ...state, loading: false };
    default:
      return state;
  }
};

function OrderPage() {
  const navigate = useNavigate();

  const [{ loading }, dispatch] = useReducer(reducer, {
    loading: false,
  });
  const { state, dispatch: contextDispatch } = useContext(Cart);
  const { cart, userInfo } = state;

  const round2Decimal = (num) => {
    return Math.round(num * 100 + Number.EPSILON) / 100;
  }; //round to 2 decimal point
  cart.itemsPrice = round2Decimal(
    cart.items.reduce((a, c) => a + c.quantity * c.price, 0)
  );
  cart.shippingPrice =
    cart.itemsPrice > 100 ? round2Decimal(0) : round2Decimal(10);
  cart.gstPrice = round2Decimal(0.08 * cart.itemsPrice);
  cart.totalPrice = cart.itemsPrice + cart.shippingPrice + cart.gstPrice;
  const placeOrder = async () => {
    try{
      dispatch({type:'CREATE_REQUEST'});
      const { data }= await axios.post('/api/orders',{
        orderItems: cart.items,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        gstPrice: cart.gstPrice,
        totalPrice: cart.totalPrice,
      },
      {
        headers: {
          authorization: `Bearer ${userInfo.token}`,
        },
      }
      );
      contextDispatch({type:'CLEAR_CART'});
      dispatch({type:'CREATE_SUCCESS'});
      localStorage.removeItem('items'); //remove items from the cart
      navigate(`/order/${data.order._id}`); //direct users to the order page
    } catch (err){
      dispatch({type:'CREATE_FAIL'});
      alert(errorMessage(err));
    }
  };

  useEffect(() => {
    if (!cart.paymentMethod) {
      navigate('/payment');
    }
  }, [cart, navigate]);

  return (
    <div>
      <CheckOut step1 step2 step3 step4></CheckOut>
      <Helmet>
        <title>Order Confirmation</title>
      </Helmet>
      <h1 className="my-3">Order Details</h1>
      <Row>
        <Col md={8}>
          <Card className="mb-4" border="dark">
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
          </Card>
          <Card className="mb-4" border="dark">
            <Card.Body>
              <Card.Title>Payment</Card.Title>
              <Card.Text>Method: {cart.paymentMethod}</Card.Text>
              <Link to="/payment">Edit</Link>
            </Card.Body>
          </Card>
          <Card className="mb-4" border="dark">
            <Card.Body>
              <Card.Title>Items in Cart</Card.Title>
              <ListGroup variant="flush">
                {cart.items.map((item) => (
                  <ListGroup.Item key={item._id}>
                    <Row className="align-items-center">
                      <Col md={6}>
                        <img
                          src={item.image}
                          alt={item.name}
                          className="img-fluid rounded img-thumbnail"></img>
                        {''}
                        <Link to={`/product/${item._id}`}>{item.name}</Link>
                      </Col>
                      <Col md={3}>
                        <span>x{item.quantity}</span>
                      </Col>
                      <Col md={3}>${item.price}</Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
              <Link to="/cart">Edit</Link>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card border="dark">
            <Card.Body>
              <Card.Title>Order Summary</Card.Title>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Items</Col>
                    <Col>${cart.itemsPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>GST</Col>
                    <Col>${cart.gstPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Shipping Fee</Col>
                    <Col>${cart.shippingPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Order Total</Col>
                    <Col>${cart.totalPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className="d-grid">
                    <Button
                      variant="warning"
                      type="button"
                      onClick={placeOrder}
                      disabled={cart.items.length === 0}>
                      Place Order
                    </Button>
                  </div>
                  {loading && <LoadingPage></LoadingPage> }
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default OrderPage;

//https://stackoverflow.com/questions/11832914/how-to-round-to-at-most-2-decimal-places-if-necessary
//https://swagger.io/docs/specification/authentication/bearer-authentication/
