import { Table, Container, Row, Col, Form, Button, Card, Navbar } from 'react-bootstrap';
import Nav from 'react-bootstrap/Nav';
import './styles.css';

import React,{ useEffect, useState } from 'react';
import logo from '../assets/Usac_logo.png'

function NavbarCustom() {
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
                <Nav.Link href="#deets">Tiempo Real</Nav.Link>
                <Nav.Link eventKey={2} href="#memes">
                Historial
                </Nav.Link>
            </Nav>
            </Container>
        </Navbar>
    )
}

export default NavbarCustom;