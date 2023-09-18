// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const ShowProducts = () => {
//   const [dataFromAPI, setDataFromAPI] = useState(null);

//   const url='http://localhost:3000';

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get(url); // Reemplaza con la URL de tu API Node.js.
//         setDataFromAPI(response.data);
//       } catch (error) {
//         console.error('Error al obtener datos desde la API Node.js:', error.message);
//       }
//     };

//     // Realiza la primera solicitud de inmediato.
//     fetchData();

//     // Configura un intervalo para realizar solicitudes cada 5 segundos.
//     const intervalId = setInterval(fetchData, 500);

//     // Puedes detener el intervalo cuando sea necesario (por ejemplo, al desmontar el componente).
//     return () => clearInterval(intervalId);
//   }, []);

//   return (
//     <div>
//       <h1>Data from API</h1>
//       {dataFromAPI && <p>{JSON.stringify(dataFromAPI)}</p>}
//     </div>
//   );
// }

// export default ShowProducts




import { Table, Container, Row, Col, Form, Button, Card, Navbar } from 'react-bootstrap';
import Accordion from 'react-bootstrap/Accordion';
import Nav from 'react-bootstrap/Nav';
import './styles.css';

import React,{ useEffect, useState } from 'react';
import axios from 'axios';
import { show_alerta } from '../functions';
import { GraficaCircular } from './GraficaCircular'
import NavbarCustom from './Navbar'
import logo from '../assets/Usac_logo.png'

const newChartData = {
    labels: ['CPU usado', 'Libre'],
    datasets: [
      {
        data: [12, 19],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
        ],
        borderWidth: 1,
      },
    ],
};

const newChartRam = {
  labels: ['RAM usada', 'Libre'],
  datasets: [
    {
      data: [40, 19],
      backgroundColor: [
        'rgba(75, 192, 192, 0.2)',
        'rgba(255, 206, 86, 0.2)',
      ],
      borderColor: [
        'rgba(75, 192, 192, 1)',
        'rgba(255, 206, 86, 1)',
      ],
      borderWidth: 1,
    },
  ],
};

const ShowProducts = () => {
    // const url='http://localhost:8000';

    const [dataFromAPI, setDataFromAPI] = useState(null);
    const [chartCPU, setChartCPU] = useState(null);
    const [chartRAM, setChartRAM] = useState(null);
    const [totalRam, setTotalRam] = useState({totalRam: 1});

  const url='http://localhost:3000';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(url); // Reemplaza con la URL de tu API Node.js.
        setDataFromAPI(response.data);
        const total_ram = response.data.data_ram.Total_ram
        const ram_uso = response.data.data_ram.Porcentaje_en_uso
        const ram_libre = 100 - ram_uso
        const chart_ram = {
          labels: ['RAM usada', 'Libre'],
          datasets: [
            {
              data: [ram_uso, ram_libre],
              backgroundColor: [
                'rgba(75, 192, 192, 0.2)',
                'rgba(255, 206, 86, 0.2)',
              ],
              borderColor: [
                'rgba(75, 192, 192, 1)',
                'rgba(255, 206, 86, 1)',
              ],
              borderWidth: 1,
            },
          ],
        };
        setChartRAM(chart_ram);
        const cpu_uso = response.data.data_cpu.porcentaje_cpu / 1000000
        const cpu_libre = 100 - cpu_uso
        const chart_cpu = {
          labels: ['CPU usado', 'Libre'],
          datasets: [
            {
              data: [cpu_uso, cpu_libre],
              backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
              ],
              borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
              ],
              borderWidth: 1,
            },
          ],
        };
        setChartCPU(chart_cpu);
        setTotalRam(total_ram)
      } catch (error) {
        console.error('Error al obtener datos desde la API Node.js:', error.message);
      }
    };

    // Realiza la primera solicitud de inmediato.
    fetchData();

    // Configura un intervalo para realizar solicitudes cada 5 segundos.
    // const intervalId = setInterval(fetchData, 1000);

    // Puedes detener el intervalo cuando sea necesario (por ejemplo, al desmontar el componente).
    // return () => clearInterval(intervalId);
  }, []);


    // const openModal = (op,id, name, description, price) =>{
    //     setId('');
    //     setName('');
    //     setDescription('');
    //     setPrice('');
    //     setOperation(op);
    //     if(op === 1){
    //         setTitle('Registrar Producto');
    //     } else if(op === 2) {
    //         setTitle('Editar Producto');
    //         setId(id);
    //         setName(name);
    //         setDescription(description);
    //         setPrice(price);
    //     }
    //     window.setTimeout(function(){
    //         document.getElementById('nombre').focus();
    //     },500);
    // }

    // const validar = () => {
    //     var parametros;
    //     var metodo;
    //     if(formData.title.trim() === '') {
    //         show_alerta('Escribe el titulo del album','warning');
    //     } else if(formData.artist.trim() === '') {
    //         show_alerta('Escribe el nombre del artista','warning');
    //     } else if(formData.year.trim() === '') {
    //         show_alerta('Escribe el año del album','warning');
    //     } else if(formData.genre.trim() === '') {
    //         show_alerta('Escribe el genero del album','warning');
    //     }
    //     parametros= {title:title.trim(),artist:artist.trim(), year:year.trim(), genre:genre.trim()};
    //     metodo= 'POST';
    //     enviarSolicitud(metodo,formData, url + "/albums");
    //     formData.title = ''
    //     formData.artist = ''
    //     formData.year = ''
    //     formData.genre = ''
    // }

    // const enviarSolicitud = async(metodo,parametros, uri) => {
    //     try {
    //         const response = await axios.post(uri, formData);
    //         console.log('Respuesta del servidor:', response.data);
    //         getProducts();
    //       } catch (error) {
    //         console.error('Error en la solicitud:', error);
    //       }
    // }

    // const handleSubmit = (event) => {
    //     event.preventDefault();
    //     validar()
    // };

    // const handleChange = (e) => {
    //     const { name, value } = e.target;
    //     setFormData((prevData) => ({
    //         ...prevData,
    //         [name]: value
    //     }));
    // };
    
  return (
    <div block="true" className='mb-6'>
        {/* <Navbar bg="dark" variant="dark">
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
        </Navbar> */}
        <NavbarCustom />
        <div>
     </div>
        <div className="container mt-4">
            <Form.Select size="lg">
                <option>Seleccione la maquina</option>
                <option value="1">One</option>
                <option value="2">Two</option>
                <option value="3">Three</option>
            </Form.Select>
            <Row className="justify-content-center">
                <Col md={3}>
                  { chartCPU != null ?
                    <GraficaCircular chartData={chartCPU} /> : "cargando"
                  }
                </Col>
                <Col md={3}>
                    { chartRAM != null ?
                      <GraficaCircular chartData={chartRAM} /> : "cargando"

                    }
                </Col>
            </Row>
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
                <Button variant="outline-danger">Kill</Button>
                </Form>
            </div>
            <h3>Procesos</h3>
            <hr/>
            
             {dataFromAPI != null ? dataFromAPI.data_cpu.procesos.map( (proceso,i)=>(
                // <h3>{proceso.nombre}</h3>
                <Accordion>
                <Accordion.Item eventKey="0">
                    <Accordion.Header>Proceso: {proceso.nombre}</Accordion.Header>
                    <Accordion.Body>
                        <Table striped text-center bordered hover className="text-center">
                            <thead>
                            <tr>
                                <th colSpan={5} style={{ backgroundColor: '#FF5733', color: 'white' }}>Proceso</th>
                            </tr>
                            <tr>
                                <th>PID</th>
                                <th>Nombre</th>
                                <th>Usuario</th>
                                <th>Estado</th>
                                <th>%RAM</th>
                            </tr>
                            </thead>
                            <tbody>
                                <tr key={i+1}>
                                    <td>{proceso.pid}</td>
                                    <td>{proceso.nombre}</td>
                                    <td>{proceso.user_id}</td>
                                    <td>{proceso.estado}</td>
                                    <td>{(proceso.ram_consumo*100/totalRam).toFixed(2)}</td>
                                </tr>
                            
                            </tbody>
                            <thead>
                            <tr>
                                <th colSpan={5} style={{ backgroundColor: ' #58d68d ', color: 'white' }}>Procesos hijos</th>
                            </tr>
                            <tr>
                                <th>PID</th>
                                <th>Nombre</th>
                                <th>Usuario</th>
                                <th>Estado</th>
                                <th>%RAM</th>
                            </tr>
                            </thead>
                            <tbody>
                            {proceso.hijos.map( (hijo,i)=>(
                                <tr key={i+1}>
                                    <td>{hijo.hijo_pid}</td>
                                    <td>{hijo.hijo_nombre}</td>
                                    <td>{proceso.user_id}</td>
                                    <td>{hijo.estado}</td>
                                    <td>{(hijo.ram_consumo*100/totalRam).toFixed(2)}</td>
                                </tr>
                            ))
                            }
                            </tbody>
                        </Table>
                    </Accordion.Body>
                </Accordion.Item>
                </Accordion>
            )) : "Cargando"
            }
            
        </div>
    </div>
    
  )
}

export default ShowProducts
