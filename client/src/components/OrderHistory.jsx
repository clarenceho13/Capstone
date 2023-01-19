import React, { useContext, useEffect, useReducer } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import LoadingPage from './LoadingPage';
import MessagePage from './MessagePage';
import { Cart } from '../Cart';
import axios from 'axios';
import errorMessage from './error';
import Button from 'react-bootstrap/Button';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, orders: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function OrderHistory() {
  const { state } = useContext(Cart);
  const { userInfo } = state;
  const navigate = useNavigate();

  const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const { data } = await axios.get(`/api/orders/ordered`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (error) {
        dispatch({ type: 'FETCH_FAIL', payload: errorMessage(error) });
      }
    };
    fetchData();
  }, [userInfo]);
  return (
    <div>
      <Helmet>
        <title>Order History</title>
      </Helmet>

      <h1>Order History</h1>
      {loading ? (
        <LoadingPage></LoadingPage>
      ) : error ? (
        <MessagePage variant="danger">{error}</MessagePage>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>DATE</th>
              <th>SUB TOTAL</th>
              <th>PAYMENT STATUS</th>
              <th>DELIVERY</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.paymentDate}</td>
                <td>${order.totalPrice.toFixed(2)}</td>
                <td>
                  {order.paymentStatus
                    ? order.paymentDate.substring(0, 10)
                    : 'Not Paid'}
                </td>
                <td>
                  {order.deliveryStatus
                    ? order.deliveryDate.subString(0, 10)
                    : 'Not Delivered'}
                </td>
                <td>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      navigate(`/order/${order._id}`);
                    }}>
                    Details
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default OrderHistory;

//https://reqbin.com/req/adf8b77i/authorization-bearer-header#:~:text=What%20is%20Bearer%20Authorization%3F,sends%20it%20to%20the%20client.
