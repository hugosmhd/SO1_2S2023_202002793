
import { Table, Container, Row, Col, Form, Button, Card, Navbar } from 'react-bootstrap';
import React,{ useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
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
        // await axios({ method:metodo, url: uri, formData}).then(function(respuesta) {
        //     // var tipo = respuesta.data[0];
        //     // var msj = respuesta.data[1];
        //     // show_alerta(msj,tipo);
        //     // if(tipo === 'success') {
        //         // document.getElementById('btnCerrar').click();
        //     getProducts();
        //     // }
        // }).catch(function(error) {
        //     show_alerta('Error en la solicitud','error');
        //     console.log(error);
        // });
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        // Realizar cualquier lógica o acción que quieras al presionar el botón
        // console.log('Botón presionado');
        validar()
        // console.log(formData.title);
        // console.log(formData.artist);
        // console.log(formData.year);
        // console.log(formData.genre);
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
            </Container>
        </Navbar>
        <Container style={{padding: '1rem'}}>
        <Row>
            <Col md={4} block="true">
                <Card style={{ backgroundColor: '#E5E8E8'}} >
                    <Card.Body>
                    <Card.Title>Formulario de Agregar Album</Card.Title>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group controlId="title">
                                <Form.Label>
                                    <i className='fa fa-music' style={{ marginRight: '10px' }}></i> 
                                    Titulo
                                </Form.Label>
                                <Form.Control 
                                    type="text" 
                                    name='title'
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="Ingresar el titulo" 
                                />
                            </Form.Group>
                            <Form.Group controlId="artist">
                                <Form.Label>
                                    <i className='fa-solid fa-palette' style={{ marginRight: '10px' }}></i> 
                                    Artista
                                </Form.Label>
                                <Form.Control 
                                    type="text"
                                    name='artist' 
                                    value={formData.artist}
                                    onChange={handleChange}
                                    placeholder="Ingresar artista"
                                />
                            </Form.Group>

                            <Form.Group controlId="year">
                                <Form.Label>
                                    <i className='fa-solid fa-calendar-days' style={{ marginRight: '10px' }}></i> 
                                    Año
                                </Form.Label>
                                <Form.Control 
                                    type="text"
                                    name='year'
                                    value={formData.year}
                                    onChange={handleChange}
                                    placeholder="Ingresar el año"
                                />
                            </Form.Group>

                            <Form.Group controlId="genre">
                                <Form.Label>
                                    <i className='fa-solid fa-headphones' style={{ marginRight: '10px' }}></i> 
                                    Genero
                                </Form.Label>
                                <Form.Control 
                                    type="text"
                                    name='genre'
                                    value={formData.genre}
                                    onChange={handleChange}
                                    placeholder="Ingresar el genero" 
                                />
                            </Form.Group>

                            <div className="d-grid gap-2">
                            {/* onClick={handleClick} */}
                                <Button block="true" variant="primary" type="submit" style={{ margin: '10px 0' }}>
                                    <i className='fa-solid fa-edit'></i> Crear
                                </Button>
                            </div>
                        </Form>
                    </Card.Body>
                </Card>
                
            </Col>
            <Col md={8}>
                <Table striped bordered hover className="w-100">
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>Titulo</th>
                        <th>Artista</th>
                        <th>Año</th>
                        <th>Genero</th>
                    </tr>
                    </thead>
                    <tbody>
                    {products.map( (product,i)=>(
                        <tr key={i+1}>
                            <td>{(i+1)}</td>
                            <td>{product.Title}</td>
                            <td>{product.Artist}</td> 
                            <td>{product.Year}</td> 
                            <td>{product.Genre}</td>
                        </tr>
                    ))
                    }
                    </tbody>
            </Table>
            </Col>
        </Row>
        </Container>
    </div>
    
  )
}

export default ShowProducts
