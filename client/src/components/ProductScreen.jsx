
import React, { useState,useEffect }from 'react'
import { useParams } from 'react-router-dom';

function ProductScreen() {
    const [selectedProduct, setSelectedProduct]= useState({});
    const params = useParams();
    const { id } = params;

    useEffect(() => {
        const fetchProduct = async () => {
          const response = await fetch(`/api/product/${id}`);
          const data = await response.json();
          setSelectedProduct(data);
        };
        fetchProduct();
      }, []);
    //console.log("product._id", product._id)
  return (
    <div>
  <h1>{id}</h1>
    </div>
  )
}

export default ProductScreen;


//cannot display the product

