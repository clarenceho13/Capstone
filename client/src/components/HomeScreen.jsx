import React, { useEffect, useReducer } from 'react';
import axios from 'axios';
import logger from 'use-reducer-logger';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Product from './Product';
import { Helmet } from 'react-helmet-async';
import LoadingPage from './LoadingPage'; //press control + space to import components easier
import MessagePage from './MessagePage';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, product: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function HomeScreen() {
  //const [product, setProduct] = useState([]);
  //const [etc, dispatch]=useReducer(reducer, initialStates)
  const [{ loading, error, product }, dispatch] = useReducer(logger(reducer), {
    product: [],
    loading: true,
    error: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' }); //to set loading : true
      try {
        const result = await axios.get('/api/product');
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data }); //if fetch is a success, return the fetch success dispatch
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: err.message });
      }
      //setProduct(result.data);
    };
    fetchData();
  }, []);
  return (
    <div>
      <Helmet>
        <title>E Commerce Site</title>
      </Helmet>
      <h1>Featured Products</h1>
      <div className="products">
        {loading ? (
          <LoadingPage />
        ) : error ? (
          <MessagePage variant="danger">{error}</MessagePage>
        ) : (
          <Row>
            {product.map((product) => (
              <Col key={product.id} sm={6} md={4} lg={3} className="mb-3">
                <Product product={product}></Product>{' '}
                {/* {product}is the prop to pass to Product.jsx*/}
              </Col>
            ))}
          </Row>
        )}
      </div>
    </div>
  );
}

export default HomeScreen;
