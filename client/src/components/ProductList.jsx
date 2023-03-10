import React, { useReducer, useContext, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { Cart } from '../Cart';
import errorMessage from './error';
import LoadingPage from './LoadingPage';
import MessagePage from './MessagePage';
import { Link } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

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

    case 'CREATE_REQUEST':
      return { ...state, loadingCreate: true };
    case 'CREATE_SUCCESS':
      return {
        ...state,
        loadingCreate: false,
      };
    case 'CREATE_FAIL':
      return { ...state, loadingCreate: false };
      case 'DELETE_REQUEST':
      return { ...state, loadingDelete: true, successDelete: false, };
    case 'DELETE_SUCCESS':
      return {
        ...state,
        loadingDelete: false,
        successDelete: true,
      };
    case 'DELETE_FAIL':
      return { ...state, loadingDelete: false, successDelete: false };
      case 'DELETE_RESET':
        return {...state, loadingDelete: false, successDelete: false};
    default:
      return state;
  }
};

function ProductList() {
  const [{ products, error, pages, loading, loadingCreate, loadingDelete, successDelete }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: '',
    });

  const navigate = useNavigate();
  const { search } = useLocation();
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
    
    if (successDelete){
        dispatch({type: 'DELETE_RESET'});
    }else {
        fetchData();
    }
  }, [page, userInfo, successDelete]);

  const createProduct = async () => {
    if (window.confirm('Ready to Proceed?')) {
      try {
        dispatch({ type: 'CREATE_REQUEST' });
        const { data } = await axios.post(
          '/api/product',
          {},
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );
        alert('Product created successfully!');
        dispatch({ type: 'CREATE_SUCCESS' });
        navigate(`/admin/product/${data.product._id}`);
      } catch (err) {
        alert(errorMessage(err));
        dispatch({
          type: 'CREATE_FAIL',
        });
      }
    }
  };

  const deleteProduct = async (product) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`/api/product/${product._id}`,{
            headers: {Authorization: `Bearer ${userInfo.token}`},
        });
        alert('Product successfully deleted!');
        dispatch({type: 'DELETE_SUCCESS'});
      } catch (err) {
        alert(errorMessage(error));
        dispatch({ type: 'DELETE_FAIL' });
      }
    }
  };

  return (
    <div>
      <Row>
        <Col>
          <h1>Products</h1>
        </Col>
        <Col className="col text-end">
          <Button type="button" variant="warning" onClick={createProduct}>
            Create Product
          </Button>
        </Col>
      </Row>
      {loadingCreate && <LoadingPage></LoadingPage>}
      {loadingDelete && <LoadingPage></LoadingPage>}

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
                  <td>
                    <Button
                      type="button"
                      variant="light"
                      onClick={() => navigate(`/admin/product/${product._id}`)}>
                      Edit
                    </Button>
                    {''}
                    <Button
                      type="button"
                      variant="light"
                      onClick={() => deleteProduct(product)}>
                      Delete
                    </Button>
                  </td>
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
