// import './styles.css';
import { Link } from 'react-router-dom';
import React,{ useEffect, useState } from 'react';

import logo from '../assets/Usac_logo.png'

function NavbarCustom() {
    const linkStyle = {
        textDecoration: 'none', // Elimina la subrayado predeterminado
        marginRight: '15px',   // Agrega espacio entre los enlaces
        color: '#b3b6b7'         // Cambia el color del texto
    };

      
    return (
        <nav className="navbar bg-dark" data-bs-theme="dark">
            <a className="navbar-brand" onClick={ ()=>navigate('/') } href="">
            <img
                src={logo}
                alt="Logo"
                width="50"
                height="50"
                className="d-inline-block align-top"
                />{' '}
                    Sistemas Operativos 1
            </a>
        </nav>
    )
}

export default NavbarCustom;