import React, { useEffect, useContext, useReducer } from 'react';
import { Cart } from '../Cart';
import { useNavigate } from 'react-router-dom';
import errorMessage from './error';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import LoadingPage from './LoadingPage';
import MessagePage from './MessagePage';
import Button from 'react-bootstrap/Button';

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return {
        ...state,
        loading: true,
      };

    case 'FETCH_SUCCESS':
      return {
        ...state,
        orders: action.payload,
        loading: false,
      };
    case 'FETCH_FAIL':
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
      case 'DELETE_REQUEST':
        return {
          ...state,
          loadingDelete: true,
          successDelete: false,
        };
  
      case 'DELETE_SUCCESS':
        return {
          ...state,
          loadingDelete: false,
          successDelete: true,
        };
      case 'DELETE_FAIL':
        return {
          ...state,
          loadingDelete: false,
        };
        case 'DELETE_RESET':
        return {
          ...state,
          loadingDelete: false,
          successDelete: false,
        };
    default:
      return state;
  }
}

function OrderList() {
  const navigate = useNavigate();
  const { state } = useContext(Cart);
  const { userInfo } = state;
  const [{ loading, error, orders, loadingDelete, successDelete }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/orders`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: errorMessage(err) });
      }
    };
    if (successDelete){
      dispatch({type: 'DELETE_RESET'});
    }else {
      fetchData();
    }
  }, [userInfo, successDelete]);

  const deleteOrder = async(order) => {
    if (window.confirm('Proceed to delete?')) {
      try {
        dispatch({ type: 'DELETE_REQUEST' });
        await axios.delete(`/api/orders/${order._id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        alert('Order deleted successfully!');
        dispatch({ type: 'DELETE_SUCCESS' });
      } catch (err) {
        alert(errorMessage(error));
        dispatch({ type: 'DELETE_FAIL' });
      }
    }
  };

  return (
    <div>
      <Helmet>
        <title>Orders</title>
      </Helmet>
      <h1>Orders</h1>
      {loadingDelete && <LoadingPage></LoadingPage>}
      {loading ? (
        <LoadingPage />
      ) : error ? (
        <MessagePage variant="danger">{error}</MessagePage>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>USER</th>

              <th>TOTAL</th>
              <th>PAID</th>
              <th>DELIVERED</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.user ? order.user.name : 'Deleted User'}</td>

                <td>${order.totalPrice.toFixed(2)}</td>
                <td>{order.paymentStatus ? order.paymentDate : 'Not Paid'}</td>
                <td>
                  {order.deliveryStatus ? order.deliveryDate : 'Not Delivered'}
                </td>
                <td>
                  <Button
                    type="button"
                    variant="light"
                    onClick={() => {
                      navigate(`/order/${order._id}`);
                    }}>
                    Details
                  </Button>
                  {''}  
                  <Button
                    type="button"
                    variant="light"
                    onClick={() => deleteOrder(order)}>
                    Delete
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

export default OrderList;
