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
import SearchBar from './components/SearchBar';
import SearchPage from './components/SearchPage';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardPage from './components/DashboardPage';
import AdminRoute from './components/AdminRoute';
import ProductList from './components/ProductList';
import ProductEdit from './components/ProductEdit';
import OrderList from './components/OrderList';
import UserList from './components/UserList';
import UserEdit from './components/UserEdit';


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

  const [openSideBar, setOpenSideBar] = useState(false); //define a state for the side bar (open and close)
  const [categories, setCategories] = useState([]);
  //console.log(categories);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`/api/product/categories`);
        setCategories(data);
      } catch (err) {
        alert(errorMessage(err));
      }
    };
    fetchCategories();
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
                variant="warning"
                onClick={() => setOpenSideBar(!openSideBar)}>
                <i className="bi bi-filter"></i>
              </Button>
              <LinkContainer to="/">
                <Navbar.Brand>Clarence's E Commerce Site</Navbar.Brand>
              </LinkContainer>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <SearchBar />
                <Nav className="me-auto w-100 justify-content-end">
                  <Link to="/cart" className="nav-link">
                    <i className="bi bi-cart4"></i>
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
                  {userInfo && userInfo.admin && (
                    <NavDropdown title="Admin" id="admin-nav-dropdown">
                      <LinkContainer to="/admin/dashboard">
                        <NavDropdown.Item>Dashboard</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/product">
                        <NavDropdown.Item>Products</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/order">
                        <NavDropdown.Item>Orders</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/user">
                        <NavDropdown.Item>Users</NavDropdown.Item>
                      </LinkContainer>
                    </NavDropdown>
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
            <Nav.Item>
              <strong>Categories</strong>
            </Nav.Item>
            {categories.map((category) => (
              <Nav.Item key={category}>
                <LinkContainer
                  to={{ pathname: 'search', search: `category=${category}` }} //`/search?category=${category}`}
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
              <Route path="/search" element={<SearchPage />} />
              <Route path="/signin" element={<SignInPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/shipping" element={<ShippingPage />} />
              <Route path="/payment" element={<PaymentModes />} />
              <Route
                path="/orderhistory"
                element={
                  <ProtectedRoute>
                    <OrderHistory />
                  </ProtectedRoute>
                }
              />
              <Route path="/order" element={<OrderPage />} />
              <Route
                path="/order/:id"
                element={
                  <ProtectedRoute>
                    <OrderStatus />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/userprofile"
                element={
                  <ProtectedRoute>
                    <UserProfile />
                  </ProtectedRoute>
                }
              />
              {/*Admin routes*/}
              <Route
                path="/admin/dashboard"
                element={
                  <AdminRoute>
                    <DashboardPage />
                  </AdminRoute>
                }
              />
              <Route
              path="/admin/product"
              element={
                <AdminRoute>
                  <ProductList />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/order"
              element={
                <AdminRoute>
                  <OrderList />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/user"
              element={
                <AdminRoute>
                  <UserList />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/product/:id"
              element={
                <AdminRoute>
                  <ProductEdit />
                </AdminRoute>
              }
            />
            <Route
            path="/admin/user/:id"
            element={
              <AdminRoute>
                <UserEdit />
              </AdminRoute>
            }
          />
              <Route path="/" element={<HomeScreen />} />
            </Routes>
          </Container>
        </main>
        <footer>
          <div className="text-center">
            <i class="bi bi-c-circle"></i>
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
