import React, { useState,useEffect }from 'react'
import { useParams } from 'react-router-dom';

function ProductScreen() {
    const [product, setProduct]= useState({});
    const {id}= useParams();

    useEffect(() => {
        const fetchProduct = async () => {
          const response = await fetch(`/api/product/${id}`);
          const data = await response.json();
          setProduct(data);
        };
        fetchProduct();
      }, []);
    
  return (
    <div>
  
    </div>
  )
}

export default ProductScreen;
