import { useParams } from 'react-router-dom';
import { useEffect, useReducer, useContext } from 'react';
import axios from 'axios';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import { Helmet } from 'react-helmet-async';
import LoadingPage from './LoadingPage';
import MessagePage from './MessagePage';
import errorMessage from './error';
import { Cart } from '../Cart';
import { useNavigate } from 'react-router-dom';
//import Ratings from './Ratings';

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

function ProductScreen() {
  const navigate = useNavigate();
  const params = useParams();
  const { id } = params;

  const [{ loading, error, product }, dispatch] = useReducer(reducer, {
    product: [],
    loading: true,
    error: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' }); //to set loading : true
      try {
        const result = await axios.get(`/api/product/${id}`);
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data }); //if fetch is a success, return the fetch success dispatch
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: errorMessage(err) }); //fetch error message from productcontroller
      }
      //setProduct(result.data);
    };
    console.log(fetchData());
  }, [id]);
  //console.log(product.id)

  const { state, dispatch: contextDispatch } = useContext(Cart);
  const { cart }= state
  //useContext to take in 'ADD_TO_CART" action
  const addToCart = async() => {
    const stockCount= cart.items.find((x)=>x._id === product._id);
    const quantity = stockCount? stockCount.quantity + 1 : 1; //quantity should increase, other set quantity to 1
    const { data } = await axios.get(`/api/product/${product._id}`);
    if (data.stock < quantity) {
      window.alert('Product is out of stock!'); //show alert that product is out of stock once stock adde to cart is reached
      return;
    }
    contextDispatch({
      type: 'ADD_TO_CART',
      payload: { ...product, quantity },
    });
    navigate('/cart'); //navigate to cart screen after adding item to the cart
  };
  return loading ? (
    <LoadingPage />
  ) : error ? (
    <MessagePage variant="danger">{error}</MessagePage>
  ) : (
    <div>
      <Row>
        <Col md={6}></Col>
        <img className="img-large" src={product.image} alt={product.name} />
        <Col md={3}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <Helmet>
                <title>{product.name}</title>
              </Helmet>
              <h1>{product.name}</h1>
            </ListGroup.Item>
            <ListGroup.Item>
              Ratings: {product.ratings}/5
              <br />
              Number of Reviews: {product.reviewNum}/5
            </ListGroup.Item>
            <ListGroup.Item>Price: ${product.price}</ListGroup.Item>
            <ListGroup.Item>
              Description:
              <p>{product.description}</p>
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={3}>
          <Card>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Price:</Col>
                    <Col>${product.price}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Status:</Col>
                    <Col>
                      {product.stock > 0 ? (
                        <Badge bg="success">In Stock</Badge>
                      ) : (
                        <Badge bg="danger">Out of Stock</Badge>
                      )}
                    </Col>
                  </Row>
                </ListGroup.Item>
                {product.stock > 0 && (
                  <ListGroup.Item>
                    <div className="d-grid">
                      <Button onClick={addToCart} variant="primary">
                        Add to Cart
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

export default ProductScreen;

//badge taken from https://react-bootstrap.github.io/components/badge/
