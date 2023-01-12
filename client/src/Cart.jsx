import React, { createContext, useReducer } from 'react';

export const Cart = createContext();

const initialState = {
  cart: {
    items: [], //this is where our add to cart will be 
  },
};

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
      return { ...state, cart: { ...state.cart, items } };

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
