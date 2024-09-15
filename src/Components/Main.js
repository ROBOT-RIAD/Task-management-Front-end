import React from 'react';
import Header from './Header/Header';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './Home/Home';
import Auth from './Auth/Auth';
import Logout from './Auth/Logout';

const Main = () => {
  const token = localStorage.getItem('token');

  const routes = token ? (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/logout' element={<Logout />} />
      <Route path='*' element={<Navigate to="/" />} />
    </Routes>
  ) : (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/login' element={<Auth />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );

  return (
    <>
      <Header />
      <div>
        {routes}
      </div>
    </>
  );
};

export default Main;
