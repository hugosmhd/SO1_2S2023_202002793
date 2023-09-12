
import { Table, Container, Row, Col, Form, Button, Card, Navbar } from 'react-bootstrap';
import Accordion from 'react-bootstrap/Accordion';
import Nav from 'react-bootstrap/Nav';
import './styles.css';

import React,{ useEffect, useState } from 'react';
import axios from 'axios';
import { show_alerta } from '../functions';
import logo from '../assets/Usac_logo.png'

const ShowProducts = () => {
    const url='http://localhost:8000';
    const [products,setProducts]= useState([]);
    const [id,setId]= useState('');
    const [name,setName]= useState('');
    const [description,setDescription]= useState('');
    const [price,setPrice]= useState('');
    const [operation,setOperation]= useState(1);
    const [title,setTitle]= useState('');
    const [artist,setArtist]= useState('');
    const [year,setYear]= useState('');
    const [genre,setGenre]= useState('');
    const [formData, setFormData] = useState({
        title: '',
        artist: '',
        year: '',
        genre: ''
      });

    // una vez que renderiza la pagina carga todos los productos
    useEffect( ()=>{
        getProducts();
    },[]);

    // hace una peticion get que manda a traer todos los productos
    const getProducts = async () => {
        const respuesta = await axios.get(url+"/albums");
        setProducts(respuesta.data.albums);
        // console.log("Holaaaaaaaaaaaaaaa");
        // console.log(products);
        // console.log(respuesta.data.albums);
    }

    const openModal = (op,id, name, description, price) =>{
        setId('');
        setName('');
        setDescription('');
        setPrice('');
        setOperation(op);
        if(op === 1){
            setTitle('Registrar Producto');
        } else if(op === 2) {
            setTitle('Editar Producto');
            setId(id);
            setName(name);
            setDescription(description);
            setPrice(price);
        }
        window.setTimeout(function(){
            document.getElementById('nombre').focus();
        },500);
    }

    const validar = () => {
        var parametros;
        var metodo;
        if(formData.title.trim() === '') {
            show_alerta('Escribe el titulo del album','warning');
        } else if(formData.artist.trim() === '') {
            show_alerta('Escribe el nombre del artista','warning');
        } else if(formData.year.trim() === '') {
            show_alerta('Escribe el año del album','warning');
        } else if(formData.genre.trim() === '') {
            show_alerta('Escribe el genero del album','warning');
        }
        parametros= {title:title.trim(),artist:artist.trim(), year:year.trim(), genre:genre.trim()};
        metodo= 'POST';
        enviarSolicitud(metodo,formData, url + "/albums");
        formData.title = ''
        formData.artist = ''
        formData.year = ''
        formData.genre = ''
    }

    const enviarSolicitud = async(metodo,parametros, uri) => {
        try {
            const response = await axios.post(uri, formData);
            console.log('Respuesta del servidor:', response.data);
            getProducts();
          } catch (error) {
            console.error('Error en la solicitud:', error);
          }
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        validar()
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };
    
  return (
    <div block="true">
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
        <div className="container mt-4">
            <Form.Select size="lg">
                <option>Seleccione la maquina</option>
                <option value="1">One</option>
                <option value="2">Two</option>
                <option value="3">Three</option>
            </Form.Select>
            <br/>
            <div className="d-flex justify-content-center">
                <h3>PID</h3>
                <Form className="d-flex align-items-center ms-3">
                <Form.Control
                    type="search"
                    placeholder="Search"
                    className="me-2"
                    aria-label="Search"
                />
                <Button variant="outline-danger" bgColor="danger">Kill</Button>
                </Form>
            </div>
            <h3>Procesos</h3>
            <hr/>
            <Accordion>
            <Accordion.Item eventKey="0">
                <Accordion.Header>Nombre del proceso</Accordion.Header>
                <Accordion.Body>
                    <Table striped text-center bordered hover className="text-center">
                        <thead>
                        <tr>
                            <th colSpan={4} style={{ backgroundColor: '#FF5733', color: 'white' }}>Proceso</th>
                        </tr>
                        <tr>
                            <th>PID</th>
                            <th>Nombre</th>
                            <th>Usuario</th>
                            <th>Estado</th>
                        </tr>
                        </thead>
                        <tbody>
                        {/* {products.map( (product,i)=>(
                            <tr key={i+1}>
                                <td>{(i+1)}</td>
                                <td>{product.Title}</td>
                                <td>{product.Artist}</td> 
                                <td>{product.Year}</td> 
                                <td>{product.Genre}</td>
                            </tr>
                        ))
                        } */}
                        </tbody>
                        <thead>
                        <tr>
                            <th colSpan={4} style={{ backgroundColor: ' #58d68d ', color: 'white' }}>Procesos hijos</th>
                        </tr>
                        <tr>
                            <th>PID</th>
                            <th>Nombre</th>
                            <th>Usuario</th>
                            <th>Estado</th>
                        </tr>
                        </thead>
                    </Table>
                </Accordion.Body>
            </Accordion.Item>
            </Accordion>
            {/* <div className="d-flex justify-content-between mb-3">
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title">En ejecucion</h5>
                        <p className="card-text text-center"><span className="badge badge-success">{summary.running}</span></p>
                    </div>
                </div>
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title">Suspendidos</h5>
                        <p className="card-text text-center"><span className="badge badge-warning">{summary.sleeping}</span></p>
                    </div>
                </div>
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title">Detenidos</h5>
                        <p className="card-text text-center"><span className="badge badge-danger">{summary.stopped}</span></p>
                    </div>
                </div>
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title">Zombie</h5>
                        <p className="card-text text-center"><span className="badge badge-secondary">{summary.zombie}</span></p>
                    </div>
                </div>
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title">Total</h5>
                        <p className="card-text text-center"><span className="badge badge-light">{summary.total}</span></p>
                    </div>
                </div>
            </div> */}
            {/* <table className="table table-stripped text-center">
                <thead>
                    <tr>
                        <th>PID</th>
                        <th>Nombre</th>
                        <th>Usuario</th>
                        <th>Estado</th>
                        <th>Kill</th>
                    </tr>
                </thead>
                <tbody>
                    {createRows()}
                </tbody>
            </table> */}
        </div>
    </div>
    
  )
}

export default ShowProducts
