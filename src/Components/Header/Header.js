import React from 'react';
import { Navbar, NavbarBrand, Nav, NavItem } from 'reactstrap';
import { NavLink } from 'react-router-dom';

const Header = () => {
  const token = localStorage.getItem('token');

  return (
    <Navbar style={{ height: '70px' }}>
      <NavbarBrand
        href='/'
        className='mr-auto ml-md-5 mx-4'
        style={{ color: '#0a0a22', fontSize: '30px' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <b className='mx-2 matemasie-regular'>TASK MANAGEMENT</b>
        </div>
      </NavbarBrand>
      <Nav className='mr-md-5' style={{ gap: '20px' }}>
      <NavItem>
              <NavLink
                to='/'
                style={{
                  color: '#0a0a22',
                  fontSize: '25px',
                  marginTop: '-25px',
                  textDecoration: 'none'
                }}
                aria-label='Home'
              >
                Home
              </NavLink>
            </NavItem>
        {token ? (
          <>
            <NavItem>
              <NavLink
                to='/logout'
                style={{
                  color: '#0a0a22',
                  fontSize: '25px',
                  marginTop: '-25px',
                  textDecoration: 'none'
                }}
                aria-label='Logout'
              >
                Logout
              </NavLink>
            </NavItem>
          </>
        ) : (
          <NavItem>
            <NavLink
              to='/login'
              style={{
                color: '#0a0a22',
                fontSize: '25px',
                marginTop: '-25px',
                textDecoration: 'none'
              }}
              aria-label='Login'
            >
              Login
            </NavLink>
          </NavItem>
        )}
      </Nav>
    </Navbar>
  );
};

export default Header;
