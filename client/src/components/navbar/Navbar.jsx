import React from 'react';
import { FaHome } from 'react-icons/fa';
import './Navbar.css';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <img src={logo} alt="Logo" className="logo" />
      <button className="back-button" onClick={() => navigate('/')}>
        <FaHome  size={20}/>
      </button>
    </nav>
  );
};

export default Navbar;
