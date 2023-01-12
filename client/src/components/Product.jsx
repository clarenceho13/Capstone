import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Ratings from './Ratings';
import axios from 'axios';
import { Cart } from '../Cart';

// props {product} is passed down from HomeScreen.jsx
function Product(props) {
  const { product } = props;
  //console.log(props)
  const { state, dispatch: contextDispatch } = useContext(Cart);
  const {
    cart: { items },
  } = state;

  const addToCart = async (item) => {
    const stockCount = items.find((x) => x._id === product._id);
    const quantity = stockCount ? stockCount.quantity + 1 : 1; //quantity should increase, other set quantity to 1
    const { data } = await axios.get(`/api/product/${item._id}`);
    if (data.stock < quantity) {
      window.alert('Product is out of stock!'); //show alert that product is out of stock once stock adde to cart is reached
      return;
    }
    contextDispatch({
      type: 'ADD_TO_CART',
      payload: { ...item, quantity },
    });
  };
  //copied function from ProductScreen so that we can add to cart in the home page
  return (
    <Card className="product">
      <Link to={`/product/${product._id}`}>
        <img src={product.image} className="card-img-top" alt={product.name} />
      </Link>
      <Card.Body>
        <Link to={`/product/${product._id}`}>
          <Card.Title>{product.name}</Card.Title>
        </Link>
        <Ratings ratings={product.ratings} reviewNum={product.reviewNum} />
        <Card.Text>${product.price}</Card.Text>
        {product.stock === 0 ? (
          <Button variant="danger">Out of Stock</Button>
        ) : (
          <Button onClick={() => addToCart(product)}>Add to Cart</Button>
        )}
      </Card.Body>
    </Card>
  );
}

export default Product;

//button taken from https://react-bootstrap.github.io/components/buttons/