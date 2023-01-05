import React from 'react';
import { Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Ratings from './Ratings';

// props {product} is passed down from HomeScreen.jsx
function Product(props) {
  const { product } = props;
  return (
    
    <Card >
      <Link to={`/product/${product.id}`}>
        <img src={product.image} className="card-img-top" alt={product.name} />
      </Link>
      <Card.Body>
      <Link to={`/product/${product.id}`}>
          <Card.Title>{product.name}</Card.Title>
        </Link>
        <Ratings ratings={product.ratings} reviewNum={product.reviewNum} />
        <Card.Text>${product.price}</Card.Text>
        <Button>Add to Cart</Button>
      </Card.Body>
    </Card>
  );
}

export default Product;
