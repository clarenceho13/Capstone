import React, { useReducer, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import errorMessage from './error';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

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

const prices= [
  {
    name: '',
    value: '',
  },


]

function SearchPage() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const searchProducts = new URLSearchParams(search); // /search?category=${category}
  const category = searchProducts.get('category') || 'all';
  const query = searchProducts.get('query') || 'all';
  const price = searchProducts.get('price') || 'all';
  const rating = searchProducts.get('rating') || 'all';
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
          `/api/product/search?page=${page}&query=${query}&category=${category}&price=${price}&rating=${rating}&order=${order}`
        );
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: errorMessage(err) }); //fetch error message from productcontroller
      }
    };
    fetchData();
  }, [page, query, category, price, rating, order]);

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
    const filterRating = filter.rating || rating;
    const sortOrder = filter.order || order;

    return `${
      skipPathname ? '' : '/search?'
    }category=${filterCategory}&query=${filterQuery}&price=${filterPrice}&rating=${filterRating}&order=${sortOrder}&page=${filterPage}`;
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
          <Link className={'all'=== price ? 'text-bold': ''}
          to={filterURL({price: 'all'})} 
          >
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
      </Row>
    </div>
  );
}

export default SearchPage;
