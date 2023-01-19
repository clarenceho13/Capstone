import React, { useContext, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomeScreen from './components/HomeScreen';
import ProductScreen from './components/ProductScreen';
import SignInPage from './components/SignInPage';
import ShippingPage from './components/ShippingPage';
import Navbar from 'react-bootstrap/Navbar';
//import NavbarToggle from 'react-bootstrap/esm/NavbarToggle';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Badge from 'react-bootstrap/Badge';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import { LinkContainer } from 'react-router-bootstrap';
import { Link } from 'react-router-dom';
import { Cart } from './Cart';
import CartPage from './components/CartPage';
import SignUpPage from './components/SignUpPage';
import PaymentModes from './components/PaymentModes';
import OrderPage from './components/OrderPage';
import OrderStatus from './components/OrderStatus';
import OrderHistory from './components/OrderHistory';
import UserProfile from './components/UserProfile';
import errorMessage from './components/error';
import axios from 'axios';

function App() {
  const { state, dispatch: contextDispatch } = useContext(Cart); //use this line for passing down context
  const { cart, userInfo } = state;

  const signOut = () => {
    contextDispatch({ type: 'USER_SIGN_OUT' });
    localStorage.removeItem('userInfo'); //clear the user info from the localstorage
    localStorage.removeItem('shippingAddress');
    localStorage.removeItem('paymentMethod');
    window.location.href = '/signin'; //direct to sign in page after successful sign out
  };

  const [openSideBar, setOpenSideBar] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`/api/product/categories`);
        setCategories(data);
      } catch (err) {
        alert(errorMessage(err));
      }
      fetchCategories();
    };
  }, []);

  return (
    <BrowserRouter>
      <div
        className={
          openSideBar
            ? 'd-flex flex-column site-container active-cont'
            : 'd-flex flex-column site-container'
        }>
        <header>
          <Navbar bg="dark" variant="dark" expand="lg">
            <Container>
              <Button
                variant="info"
                onClick={() => setOpenSideBar(!openSideBar)}>
                <i class="bi bi-three-dots-vertical"></i>
              </Button>
              <LinkContainer to="/">
                <Navbar.Brand>Clarence's E Commerce Site</Navbar.Brand>
              </LinkContainer>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto w-100 justify-content-end">
                  <Link to="/cart" className="nav-link">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="25"
                      height="25"
                      fill="currentColor"
                      className="bi bi-cart4"
                      viewBox="0 0 16 16">
                      <path d="M0 2.5A.5.5 0 0 1 .5 2H2a.5.5 0 0 1 .485.379L2.89 4H14.5a.5.5 0 0 1 .485.621l-1.5 6A.5.5 0 0 1 13 11H4a.5.5 0 0 1-.485-.379L1.61 3H.5a.5.5 0 0 1-.5-.5zM3.14 5l.5 2H5V5H3.14zM6 5v2h2V5H6zm3 0v2h2V5H9zm3 0v2h1.36l.5-2H12zm1.11 3H12v2h.61l.5-2zM11 8H9v2h2V8zM8 8H6v2h2V8zM5 8H3.89l.5 2H5V8zm0 5a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0zm9-1a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0z" />
                    </svg>
                    {cart.items.length > 0 && (
                      <Badge pill bg="danger">
                        {cart.items.reduce((a, c) => a + c.quantity, 0)}
                      </Badge>
                    )}
                  </Link>

                  {userInfo ? (
                    <NavDropdown title={userInfo.name} id="nav-dropdown">
                      <LinkContainer to="/userprofile">
                        <NavDropdown.Item>Your Account</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/orderhistory">
                        <NavDropdown.Item>Your Orders</NavDropdown.Item>
                      </LinkContainer>
                      <Link
                        className="dropdown-item"
                        to="#signout"
                        onClick={signOut}>
                        Sign Out
                      </Link>
                    </NavDropdown>
                  ) : (
                    <Link to="/signin" className="nav-link">
                      Hello, Sign in
                    </Link>
                  )}
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
        </header>
        <div
          className={
            openSideBar
              ? 'active-nav side-navbar d-flex justify-content-between flex-wrap flex-column'
              : 'side-navbar d-flex justify-content-between flex-wrap flex-column'
          }>
          <Nav className="flex-column text-white w-100 p-2">
            <Nav.Item>Categories</Nav.Item>
            {categories.map((category) => (
              <Nav.Item key={category}>
                <LinkContainer
                  to={`/search?category=${category}`}
                  onClick={() => setOpenSideBar(false)}>
                  <Nav.Link>{category}</Nav.Link>
                </LinkContainer>
              </Nav.Item>
            ))}
          </Nav>
        </div>
        <main>
          <Container className="mt-3">
            <Routes>
              <Route path="/product/:id" element={<ProductScreen />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/signin" element={<SignInPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/shipping" element={<ShippingPage />} />
              <Route path="/payment" element={<PaymentModes />} />
              <Route path="/orderhistory" element={<OrderHistory />} />
              <Route path="/order" element={<OrderPage />} />
              <Route path="/order/:id" element={<OrderStatus />} />
              <Route path="/userprofile" element={<UserProfile />} />
              <Route path="/" element={<HomeScreen />} />
            </Routes>
          </Container>
        </main>
        <footer>
          <div className="text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              fillRule="currentColor"
              className="bi bi-c-circle"
              viewBox="0 0 16 16">
              <path d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8Zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0ZM8.146 4.992c-1.212 0-1.927.92-1.927 2.502v1.06c0 1.571.703 2.462 1.927 2.462.979 0 1.641-.586 1.729-1.418h1.295v.093c-.1 1.448-1.354 2.467-3.03 2.467-2.091 0-3.269-1.336-3.269-3.603V7.482c0-2.261 1.201-3.638 3.27-3.638 1.681 0 2.935 1.054 3.029 2.572v.088H9.875c-.088-.879-.768-1.512-1.729-1.512Z" />
            </svg>
            All rights reserved
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;

//cart logo <svg> taken from https://icons.getbootstrap.com/icons/cart4/
//reduce function is use for calculate quantity
//https://www.w3schools.com/js/js_window_location.asp
