import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Page1 from './pages/Page1.jsx';
import Page2 from './pages/Page2.jsx';
import './styles/App.css';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Page1 />} />
        <Route path="/page2" element={<Page2 />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
