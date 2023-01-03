import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomeScreen from './components/HomeScreen';
import ProductScreen from './components/ProductScreen';

function App() {
  
  return (
    <BrowserRouter>
      <div>
        <header>
          <a href="/">Amazon</a>
        </header>
        <main>
          <Routes>
          <Route path="/product/:id" element={<ProductScreen />} />
            <Route path="/" element={<HomeScreen />} />
          </Routes>
          
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
