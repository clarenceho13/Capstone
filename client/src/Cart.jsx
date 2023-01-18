import React, { createContext, useReducer } from 'react';

export const Cart = createContext();

const initialState = {
  userInfo: localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null,

  cart: {
    shippingAddress: localStorage.getItem('shippingAddress')
      ? JSON.parse(localStorage.getItem('shippingAddress'))
      : {},
    items: localStorage.getItem('items')
      ? JSON.parse(localStorage.getItem('items'))
      : [],
      paymentMethod: localStorage.getItem('paymentMethod')
      ? localStorage.getItem('paymentMethod')
      : '',
  },
};
//items are stored in local storage and should not be empty array
//reducer is independent of the component and hence declared outside
function reducer(state, action) {
  switch (action.type) {
    case 'ADD_TO_CART':
      const newItem = action.payload;
      const stockCount = state.cart.items.find(
        (item) => item._id === newItem._id
      );
      const items = stockCount
        ? state.cart.items.map((item) =>
            item._id === stockCount._id ? newItem : item
          )
        : [...state.cart.items, newItem];
      localStorage.setItem('items', JSON.stringify(items));
      return { ...state, cart: { ...state.cart, items } };

    case 'DELETE_FROM_CART': {
      const items = state.cart.items.filter(
        (item) => item._id !== action.payload._id
      );
      localStorage.setItem('items', JSON.stringify(items));
      return { ...state, cart: { ...state.cart, items } };
    }
    case 'CLEAR_CART':
      return {...state, cart:{...state.cart, items:[]}}
    case 'USER_SIGN_IN':
      return { ...state, userInfo: action.payload };

    case 'USER_SIGN_OUT':
      return {
        ...state,
        userInfo: null,
        cart: {
          shippingAddress: {},
          items: [],
          paymentMethod: '',
        },
      };

    case 'SAVE_SHIPPING_ADDRESS':
      return {
        ...state,
        cart: { ...state.cart, shippingAddress: action.payload },
      };
    case 'SAVE_PAYMENT_METHOD':
      return {
        ...state,
        cart: { ...state.cart, paymentMethod: action.payload },
      };
    default:
      return state;
  }
}

function CartProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <Cart.Provider value={value}>{props.children}</Cart.Provider>;
}

export default CartProvider;

//for adding new item to cart
//usecontext so that item can be added to cart anywhere
//local storage allows you to save key/value pairs in the browser. https://www.w3schools.com/jsref/prop_win_localstorage.asp
