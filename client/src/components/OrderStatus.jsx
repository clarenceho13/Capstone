import React, { useReducer, useContext, useEffect } from 'react';
import LoadingPage from './LoadingPage';
import MessagePage from './MessagePage';
import { useNavigate, useParams } from 'react-router-dom';
import { Cart } from '../Cart';
import axios from 'axios';
import errorMessage from './error';
import { Helmet } from 'react-helmet-async';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import { Link } from 'react-router-dom';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import Button from 'react-bootstrap/Button';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, order: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'PAY_REQUEST':
      return { ...state, loadingPay: true };
    case 'PAY_SUCCESS':
      return { ...state, loadingPay: false, successPay: true };
    case 'PAY_FAIL':
      return { ...state, loadingPay: false };
    case 'PAY_RESET':
      return { ...state, loadingPay: false, successPay: false };
    case 'DELIVER_REQUEST':
      return { ...state, loadingDeliver: true };
    case 'DELIVER_SUCCESS':
      return { ...state, loadingDeliver: false, successDeliver: true };
    case 'DELIVER_FAIL':
      return { ...state, loadingDeliver: false, errorDeliver: action.payload };
    case 'DELIVER_RESET':
      return {
        ...state,
        loadingDeliver: false,
        successDeliver: false,
        errorDeliver: '',
      };
    default:
      return state;
  }
};

function OrderStatus() {
  const { state } = useContext(Cart);
  const { userInfo } = state;

  const params = useParams();
  const { id: orderId } = params;
  const navigate = useNavigate();

  const [
    {
      loading,
      error,
      order,
      loadingPay,
      successPay,
      loadingDeliver,
      successDeliver,
    },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    order: {},
    error: '',
    successPay: false,
    loadingPay: false,
  });

  //dispatch paypalreducer
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();
  function createOrder(data, actions) {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: { value: order.totalPrice },
          },
        ],
      })
      .then((orderID) => {
        return orderID;
      });
  }

  function onApprove(data, actions) {
    return actions.order.capture().then(async function (details) {
      try {
        dispatch({ type: 'PAY_REQUEST' });
        const { data } = await axios.put(
          `/api/orders/${order._id}/pay`,
          details,
          {
            headers: { authorization: `Bearer ${userInfo.token}` },
          }
        );
        dispatch({ type: 'PAY_SUCCESS', payload: data });
        alert('Order Completed!');
      } catch (err) {
        dispatch({ type: 'PAY_FAIL', payload: errorMessage(err) });
        alert(errorMessage(err));
      }
    });
  }
  function onError(err) {
    alert(errorMessage(err));
  }

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/orders/${orderId}`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: errorMessage(err) });
      }
    };
    if (!userInfo) {
      navigate('/signin'); //signin?
    }
    if (
      !order._id ||
      successPay ||
      successDeliver ||
      (order._id && order._id !== orderId)
    ) {
      fetchOrder();
      if (successPay) {
        dispatch({ type: 'PAY_RESET' });
      }
      if (successDeliver) {
        dispatch({ type: 'DELIVER_RESET' });
      }
    } else {
      const loadPayPalScript = async () => {
        const { data: clientId } = await axios.get('/api/keys/paypal', {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        paypalDispatch({
          type: 'resetOptions',
          value: {
            'client-id': clientId,
            currency: 'SGD',
          },
        });
        paypalDispatch({ type: 'setLoadingStatus', value: 'pending' });
      };
      loadPayPalScript();
    }
  }, [
    order,
    userInfo,
    orderId,
    navigate,
    paypalDispatch,
    successPay,
    successDeliver,
  ]);

  async function deliverOrder() {
    try {
      dispatch({type: 'DELIVER_REQUEST'});
      const { data }= await axios.put(
        `/api/orders/${order._id}/deliver`,
        {},
        {
          headers: {authorization: `Bearer ${userInfo.token}`},
        }
      );
      dispatch({type: 'DELIVER_SUCCESS', payload: data });
      alert.success('Order is delivered');
    }catch (err){
      alert.error(errorMessage(err));
      dispatch({type: 'DELIVER_FAIL'});
    }
  }

  return loading ? (
    <LoadingPage></LoadingPage>
  ) : error ? (
    <MessagePage variant="danger">{error}</MessagePage>
  ) : (
    <div>
      <Helmet>
        <title>Order {orderId}</title>
      </Helmet>
      <h1 className="my-3">Order ID: {orderId}</h1>
      <Row>
        <Col md={8}>
          <Card className="mb-3" border="dark">
            <Card.Body>
              <Card.Title>Shipping Details</Card.Title>
              <Card.Text>
                Name: {order.shippingAddress.fullName}
                <br />
                Address : {order.shippingAddress.address}
                <br />
                Contact Number: {order.shippingAddress.number}
                <br />
                Postal Code: {order.shippingAddress.postalCode}
              </Card.Text>
            </Card.Body>
          </Card>
          <Card className="mb-3" border="dark">
            <Card.Body>
              <Card.Title>Delivery Status:</Card.Title>

              {order.deliveryStatus ? (
                <MessagePage variant="success">
                  Delivered on: {order.deliveryDate}
                </MessagePage>
              ) : (
                <MessagePage variant="danger">Not Delivered</MessagePage>
              )}
            </Card.Body>
          </Card>
          <Card className="mb-3" border="dark">
            <Card.Body>
              <Card.Title>Payment</Card.Title>
              <Card.Text>Payment Option: {order.paymentMethod}</Card.Text>
              {order.paymentStatus ? (
                <MessagePage variant="success">
                  Payment Date and Time: {order.paymentDate}
                </MessagePage>
              ) : (
                <MessagePage variant="danger">Not Paid</MessagePage>
              )}
            </Card.Body>
          </Card>
          <Card className="mb-3" border="dark">
            <Card.Body>
              <Card.Title>Items in Cart</Card.Title>

              <ListGroup variant="flush">
                {order.orderItems.map((item) => (
                  <ListGroup.Item key={item._id}>
                    <Row classname="align-items-center">
                      <Col md={6}>
                        <img
                          src={item.image}
                          alt={item.name}
                          className="img-fluid rounded img-thumbnail"
                        />
                        {''}
                        <Link to={`/product/${item.tag}`}>{item.name}</Link>
                      </Col>
                      <Col md={3}>x{item.quantity}</Col>
                      <Col md={3}>${item.price}</Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-3" border="dark">
            <Card.Body>
              <Card.Title>Order Summary</Card.Title>
              <ListGroup>
                <ListGroup.Item>
                  <Row>
                    <Col>Items</Col>
                    <Col>${order.itemsPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Shipping Fee</Col>
                    <Col>${order.shippingPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>GST 8%</Col>
                    <Col>${order.gstPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Total Price</Col>
                    <Col>${order.totalPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                {!order.paymentStatus && (
                  <ListGroup.Item>
                    {isPending ? (
                      <LoadingPage />
                    ) : (
                      <div>
                        <PayPalButtons>
                          createOrder = {createOrder}
                          onApprove ={onApprove}
                          onError= {onError}
                        </PayPalButtons>
                      </div>
                    )}
                    {loadingPay && <LoadingPage></LoadingPage>}
                  </ListGroup.Item>
                )}
                {userInfo.admin &&
                  order.paymentStatus &&
                  !order.deliveryStatus && (
                    <ListGroup.Item>
                      {loadingDeliver && <LoadingPage></LoadingPage>}
                      <div className="d-grid">
                        <Button type="button" onClick={deliverOrder}>
                          Deliver Order
                        </Button>
                      </div>
                    </ListGroup.Item>
                  )}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default OrderStatus;

//https://react-bootstrap.github.io/components/list-group/
//toFixed(x)=> fixed x decimal points
