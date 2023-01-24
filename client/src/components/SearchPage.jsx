import React, { useReducer, useEffect, useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import errorMessage from './error';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import LoadingPage from '../components/LoadingPage';
import MessagePage from './MessagePage';
import Product from '../components/Product';
import LinkContainer from 'react-router-bootstrap/LinkContainer';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return {
        ...state,
        loading: true,
      };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        products: action.payload.products,
        page: action.payload.page,
        pages: action.payload.pages,
        productCount: action.payload.productCount,
        loading: false,
      };

    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

const prices = [
  {
    name: '$1-50',
    value: '1-50',
  },
  {
    name: '$50-500',
    value: '50-500',
  },
  {
    name: '$500-1000',
    value: '500-1000',
  },
  {
    name: '$1000-1500',
    value: '1000-1500',
  },
  {
    name: '$1500-2000',
    value: '1500-2000',
  },
];

function SearchPage() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const searchProducts = new URLSearchParams(search); // /search?category=${category}
  const category = searchProducts.get('category') || 'all';
  const query = searchProducts.get('query') || 'all';
  const price = searchProducts.get('price') || 'all';
  //const rating = searchProducts.get('rating') || 'all';
  const order = searchProducts.get('order') || 'newest';
  const page = searchProducts.get('page') || 1; //pagination

  const [{ loading, error, products, pages, productCount }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: '',
    });
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `/api/product/search?page=${page}&query=${query}&category=${category}&price=${price}&order=${order}`
        );
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: errorMessage(err) }); //fetch error message from productcontroller
      }
    };
    fetchData();
  }, [page, query, category, price, order]);

  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get('/api/product/categories');
        setCategories(data);
      } catch (err) {
        alert(errorMessage(err));
      }
    };
    fetchCategories();
  }, [dispatch]); //dispatch is the dependency

  const filterURL = (filter, skipPathname) => {
    const filterPage = filter.page || page;
    const filterCategory = filter.category || category;
    const filterQuery = filter.query || query;
    const filterPrice = filter.price || price;
    const sortOrder = filter.order || order;

    return `${
      skipPathname ? '' : '/search?'
    }category=${filterCategory}&query=${filterQuery}&price=${filterPrice}&order=${sortOrder}&page=${filterPage}`;
  };

  return (
    <div>
      <Helmet>
        <title>Search Products</title>
      </Helmet>
      <Row>
        <Col md={3}>
          <h3>Classification</h3>
          <div>
            <ul>
              <li>
                <Link
                  className={'all' === category ? 'text-bold' : ''}
                  to={filterURL({ category: 'all' })}>
                  Any
                </Link>
              </li>
              {categories.map((cat) => (
                <li key={cat}>
                  <Link
                    className={cat === category ? 'text-bold' : ''}
                    to={filterURL({ category: cat })}>
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3>Price</h3>
            <ul>
              <li>
                <Link
                  className={'all' === price ? 'text-bold' : ''}
                  to={filterURL({ price: 'all' })}>
                  Any
                </Link>
              </li>
              {prices.map((p) => (
                <li key={p.value}>
                  <Link
                    className={p.value === price ? 'text-bold' : ''}
                    to={filterURL({ price: p.value })}>
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </Col>
        <Col md={9}>
          {loading ? (
            <LoadingPage />
          ) : error ? (
            <MessagePage variant="danger">{error}</MessagePage>
          ) : (
            <div>
              <Row className="justify-content-between mb-3">
                <Col md={6}>
                  <div>
                    {productCount === 0 ? 'No' : productCount} Results
                    {query !== 'all' && ' : ' + query}
                    {category !== 'all' && ' : ' + category}
                    {price !== 'all' && ' : Price ' + price}
                    {query !== 'all' ||
                    category !== 'all' ||
                    price !== 'all' ? (
                      <Button
                        variant="light"
                        onClick={() => navigate('/search')}>
                        <i class="bi bi-0-circle"></i>
                      </Button>
                    ) : null}
                  </div>
                </Col>
                <Col className="text-end">
                  Sort by{' '}
                  <select
                    value={order}
                    onChange={(e) => {
                      navigate(filterURL({ order: e.target.value }));
                    }}>
                    <option value="newest">Newest Arrivals</option>
                    <option value="lowest">Price: Low to High</option>
                    <option value="highest">Price: High to Low</option>
                  </select>
                </Col>
              </Row>
              {products.length === 0 && (
                <MessagePage>Product Not Found</MessagePage>
              )}

              <Row>
                {products.map((product) => (
                  <Col sm={6} lg={4} className="mb-3" key={product._id}>
                    <Product product={product}></Product>
                  </Col>
                ))}
              </Row>
              {/* pagination */}
              <div>
              {[...Array(pages).keys()].map((x) => (
                <LinkContainer
                  key={x + 1}
                  className="mx-1"
                  to={{
                    pathname: '/search',
                    search: filterURL({ page: x + 1 }, true),
                  }}
                >
                  <Button
                    className={Number(page) === x + 1 ? 'text-bold' : ''}
                    variant="light"
                  >
                    {x + 1}
                  </Button>
                </LinkContainer>
              ))}
            </div>
            </div>
          )}
        </Col>
      </Row>
    </div>
  );
}

export default SearchPage;

//https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams/URLSearchParams