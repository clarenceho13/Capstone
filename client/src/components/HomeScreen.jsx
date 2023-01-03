import React, { useState, useEffect } from 'react'

function HomeScreen() {
    const [product, setProduct] = useState([]);

  useEffect(() => {
    fetch(`/api/product/`)
      .then((response) => response.json())
      .then((data) => setProduct(data));
  }, []);
  return (
    <div>
    <h1>Featured Products</h1>
    <div className="products">
      {product.map((product) => (
        <div className="product" key={product.id}>
          <a href={`/product/${product.id}`}>
            <img src={product.image} alt={product.name} />
          </a>

          <div className="product-info">
            <a href={`/product/${product.id}`}>
              <p>{product.name}</p>
            </a>

            <p>{product.price}</p>
            <button>Add to Cart</button>
          </div>
        </div>
      ))}
    </div>
    </div>
  )
}

export default HomeScreen;
