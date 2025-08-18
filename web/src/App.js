import React, { useRef, useState, useEffect } from 'react';
import FullScene from './components/FullScene';
import Login from './components/LoginPage';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";




export default function App() {

  return (
    <Router>

      <Routes>
        <Route path="/" element={<FullScene />} />
        <Route path="/doit" element={<Login />} />
      </Routes>
    </Router>
  );


}
