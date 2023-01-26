import React, { useReducer, useContext, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { Cart } from '../Cart';
import errorMessage from './error';
import LoadingPage from './LoadingPage';
import MessagePage from './MessagePage';
import { Link } from 'react-router-dom';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        products: action.payload.products,
        page: action.payload.page,
        pages: action.payload.pages,
        loading: false,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function ProductList() {
  const [{ products, error, pages, loading }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
  });

  const { search, pathname } = useLocation();
  const searchParam = new URLSearchParams(search);
  const page = searchParam.get('page') || 1;

  const { state } = useContext(Cart);
  const { userInfo } = state;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`/api/product/admin?page=${page}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: errorMessage(err) });
      }
    };
    fetchData();
  }, [page, userInfo]);
  return (
    <div>
      <h1>Products</h1>
      {loading ? (
        <LoadingPage />
      ) : error ? (
        <MessagePage variant="danger">{error}</MessagePage>
      ) : (
        <div>
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>PRICE</th>
                <th>CATEGORY</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>{product._id}</td>
                  <td>{product.name}</td>
                  <td>{product.price}</td>
                  <td>{product.category}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div>
            {[...Array(pages).keys()].map((x) => (
              <Link
                className={x + 1 === Number(page) ? 'btn text-bold' : 'btn'}
                key={x + 1}
                to={`/admin/product?page=${x + 1}`}>
                {x + 1}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductList;
