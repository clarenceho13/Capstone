import { useParams } from 'react-router-dom';
import { useEffect, useReducer } from 'react';
import axios from 'axios';

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
        dispatch({ type: 'FETCH_FAIL', payload: err.message });
      }
      //setProduct(result.data);
    };
    fetchData();
  }, [id]);
  //console.log(product.id)
  return loading ? (
    <div>Loading...</div>
  ) : error ? (
    <div>{error}</div>
  ) : (
    <div>{product.name}</div>
  );
}

export default ProductScreen;

//cannot display the product
