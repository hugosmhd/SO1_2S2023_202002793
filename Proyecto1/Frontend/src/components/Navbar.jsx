import { Table, Container, Row, Col, Form, Button, Card, Navbar } from 'react-bootstrap';
import Nav from 'react-bootstrap/Nav';
import './styles.css';
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
        <Navbar bg="dark" variant="dark">
            <Container>
            <Navbar.Brand className="align-items-center justify-content-between">
                <img
                src={logo}
                alt="Logo"
                width="50"
                height="50"
                className="d-inline-block align-top"
                />{' '}
                    Sistemas Operativos 1
            </Navbar.Brand>

            <Nav>
                <Link to="/tiempo-real" style={linkStyle}>Tiempo Real</Link>
                <Link to="/historial" style={linkStyle}>Historial</Link>
            </Nav>
            </Container>
        </Navbar>
    )
}

export default NavbarCustom;