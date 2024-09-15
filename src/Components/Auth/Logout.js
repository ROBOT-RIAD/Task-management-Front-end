import React from 'react';
import { Navigate } from 'react-router-dom';

const Logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('expirationsTime');
    localStorage.removeItem('userId');
    window.location.reload();
    return <Navigate to='/' />;
}

export default Logout;
