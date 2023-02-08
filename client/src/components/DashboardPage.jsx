import React, { useReducer, useContext, useEffect } from 'react';
import { Cart } from '../Cart';
import errorMessage from './error';
import axios from 'axios';
import LoadingPage from './LoadingPage';
import MessagePage from './MessagePage';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
//import MessagePage from './MessagePage';
import Chart from 'react-google-charts';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, summary: action.payload, loading: false }; //success show summary of everything
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function DashboardPage() {
  const [{ loading, summary, error }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
  });
  const { state } = useContext(Cart);
  const { userInfo } = state;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get('/api/orders/summary', {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: errorMessage(err) });
      }
    };
    fetchData();
  }, [userInfo]);
  return (
    <div>
      <h1>Dashboard</h1>
      {loading ? (
        <LoadingPage></LoadingPage>
      ) : error ? (
        <MessagePage variant="danger">{error}</MessagePage>
      ) : (
        <div>
          <Row>
            <Col md={4}>
              <Card>
                <Card.Body>
                  <Card.Title>
                    $
                    {summary.orders && summary.users[0]
                      ? summary.orders[0].totalSales.toFixed(2)
                      : 0}
                  </Card.Title>
                  <Card.Text>Orders</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <div className="my-3">
            <h2>Sales Figures</h2>
            {summary.dailyOrders.length === 0 ? (
              <MessagePage>No Sales</MessagePage>
            ) : (
              <Chart
                width="100%"
                height="400px"
                chartType="AreaChart"
                loader={<div>Loading Chart...</div>}
                data={[
                  ['Date', 'Sales'],
                  ...summary.dailyOrders.map((x) => [x._id, x.sales]),
                ]}></Chart>
            )}
          </div>
          <div className="my-3">
            <h2>Product Categories</h2>
            {summary.productCategories.length === 0 ? (
              <MessagePage>No category</MessagePage>
            ) : (
              <Chart
                width="100%"
                height="400px"
                chartType="PieChart"
                loader={<div>Loading Chart...</div>}
                data={[
                  ['Category', 'Products'],
                  ...summary.productCategories.map((x) => [x._id, x.count]),
                ]}></Chart>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default DashboardPage;

//https://www.react-google-charts.com/
