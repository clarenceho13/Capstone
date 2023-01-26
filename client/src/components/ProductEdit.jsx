import React, { useContext, useReducer, useState, useEffect } from 'react';
import { Cart } from '../Cart';
import errorMessage from './error';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import { Helmet } from 'react-helmet-async';
import LoadingPage from './LoadingPage';
import MessagePage from './MessagePage';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'UPDATE_REQUEST':
      return { ...state, loadingUpdate: true };
    case 'UPDATE_SUCCESS':
      return { ...state, loadingUpdate: false };
    case 'UPDATE_FAIL':
      return { ...state, loadingUpdate: false };
    case 'UPLOAD_REQUEST':
      return { ...state, loadingUpload: true, errorUpload: '' };
    case 'UPLOAD_SUCCESS':
      return { ...state, loadingUpload: false, errorUpload: '' };
    case 'UPLOAD_FAIL':
      return { ...state, loadingUpload: false, errorUpload: action.payload };
    default:
      return state;
  }
};

function ProductEdit() {
  const navigate = useNavigate();
  const params = useParams();
  const { id: productId } = params;

  const { state } = useContext(Cart);
  const { userInfo } = state;
  const [{ loading, error, loadingUpdate, loadingUpload }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: '',
    });

  const [name, setName] = useState('');
  const [tag, setTag] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [ratings, setRatings] = useState('');
  const [reviewNum, setReviewNum] = useState('');
  const [stock, setStock] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/product/${productId}`);
        setName(data.name);
        setTag(data.tag);
        setDescription(data.description);
        setPrice(data.price);
        setImage(data.image);
        setRatings(data.ratings);
        setReviewNum(data.reviewNum);
        setStock(data.stock);
        setCategory(data.category);
        dispatch({ type: 'FETCH_SUCCESS' });
      } catch (err) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: errorMessage(err),
        });
      }
    };
    fetchData();
  }, [productId]);
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch({ type: 'UPDATE_REQUEST' });
      await axios.put(
        `/api/product/${productId}`,
        {
          _id: productId,
          name,
          tag,
          description,
          price,
          image,
          ratings,
          reviewNum,
          stock,
          category,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({
        type: 'UPDATE_SUCCESS',
      });
      alert('Product Updated Successfully!');
      navigate('/admin/product');
    } catch (err) {
      alert(errorMessage(err));
      dispatch({ type: 'UPDATE_FAIL' });
    }
  };

  const uploadFile = async (e) => {
    const file = e.target.files[0];
    const bodyFormData = new FormData();
    bodyFormData.append('file', file);
    try {
      dispatch({ type: 'UPLOAD_REQUEST' });
      const { data } = await axios.post('/api/upload', bodyFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          authroization: `Bearer ${userInfo.token}`,
        },
      });
      dispatch({ type: 'UPLOAD_SUCCESS' });
      alert('Image successfully upload!');
      setImage(data.secure_url);
    } catch (err) {
      alert(errorMessage(err));
      dispatch({ type: 'UPLOAD_FAIL', payload: errorMessage(err) });
    }
  };
  return (
    <Container className="small-container">
      <Helmet>
        <title>Edit Product ${productId}</title>
      </Helmet>
      <h1>Edit Product {productId}</h1>

      {loading ? (
        <LoadingPage />
      ) : error ? (
        <MessagePage variant="danger">{error}</MessagePage>
      ) : (
        <Form onSubmit={submitHandler}>
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="tag">
            <Form.Label>Tag</Form.Label>
            <Form.Control
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="description">
            <Form.Label>Description</Form.Label>
            <Form.Control
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="price">
            <Form.Label>Price</Form.Label>
            <Form.Control
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="image">
            <Form.Label>Image File</Form.Label>
            <Form.Control
              value={image}
              onChange={(e) => setImage(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="imageFile">
            <Form.Label>Upload File</Form.Label>
            <Form.Control type="file" onChange={uploadFile} />
            {loadingUpload && <LoadingPage />}
          </Form.Group>

          <Form.Group className="mb-3" controlId="ratings">
            <Form.Label>Ratings</Form.Label>
            <Form.Control
              value={ratings}
              onChange={(e) => setRatings(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="reviewNum">
            <Form.Label>Number of Reviews</Form.Label>
            <Form.Control
              value={reviewNum}
              onChange={(e) => setReviewNum(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="stock">
            <Form.Label>Stock</Form.Label>
            <Form.Control
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="category">
            <Form.Label>Category</Form.Label>
            <Form.Control
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
          </Form.Group>
          <div className="mb-3">
            <Button disabled={loadingUpdate} type="submit">
              Update
            </Button>
            {loadingUpdate && <LoadingPage />}
          </div>
        </Form>
      )}
    </Container>
  );
}

export default ProductEdit;
