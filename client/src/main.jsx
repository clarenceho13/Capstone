import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { HelmetProvider } from 'react-helmet-async';
import CartProvider from './Cart';
import { PayPalScriptProvider} from '@paypal/react-paypal-js';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CartProvider>
      <HelmetProvider>
      <PayPalScriptProvider deferLoading={true}>
      <App />
      </PayPalScriptProvider>
        
      </HelmetProvider>
    </CartProvider>
  </React.StrictMode>
);

//https://www.npmjs.com/package/@paypal/react-paypal-js