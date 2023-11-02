import { Table, Container, Row, Col, Form, Button, Card, Navbar } from 'react-bootstrap';
import './styles.css';

import React, { useEffect, useState } from 'react';
import axios from './axios-config';
import socket from '../socket/Socket'
import { GraficaBarras } from "./GraficaBarras";
import NavbarCustom from './Navbar'


const TiempoReal = () => {
    
  const [seleccionSemestre, setSeleccionSemestre] = useState(1);
  const [chartBarReal, setChartBarReal] = useState(null);
  const [totalAlumnos, setTotalAlumnos] = useState(0);
  const [usuarios, setUsuarios] = useState([])
  const [tablaUsuarios, setTablaUsuarios] = useState([])
  const [totalDatos, setTotalDatos] = useState(0)
  const [cursos, setCursos] = useState([])
  const [cantidadAlumnos, setCantidadAlumnos] = useState([])

  const url = 'http://34.41.203.179:3000';
  // const url = 'http://localhost:3000';
  useEffect(() => {
    socket.on("getDataRedis", (value) => {
      console.log(value);
      setTotalDatos(value.suma_contadores)
      setTotalAlumnos(value.total_alumnos)
      let chart_bar_real = {
        labels: value.labels,
        datasets: [
            {
                label: 'Cantidad Alumnos',
                data: value.valores
            }
        ]
      };
      setChartBarReal(chart_bar_real);
    });
    return () => {
    };
  }, []);

  useEffect(() => {
    axios.get(`${url}/semestre/${seleccionSemestre}`)
    .then(response => {
      // Procesa la respuesta del servidor
    })
    .catch(error => {
      // Maneja errores
  //     console.error(error);
    });
  }, [seleccionSemestre]);

  const handleSelectChange = (event) => {
    const valorSeleccionado = event.target.value;
    setSeleccionSemestre(valorSeleccionado);
    setChartBarReal(null)
    // console.log(valorSeleccionado);
  };


  return (
    <div block="true" className='mb-6'>
      <NavbarCustom />
      <div className="container mt-4">
      <div className="d-flex justify-content-between">
        <h3>Redis</h3>
        <h5>Cantidad de Datos que pasan por la 2da URL: {totalDatos == null ? "0" : totalDatos}</h5>
      </div>


        <Form.Select size="lg" onChange={handleSelectChange} value={seleccionSemestre}>
            <option value="1">1er Semestre - 1S</option>
            <option value="2">2do Semestre - 2S</option>
        </Form.Select>
        <div className="d-flex justify-content-between">
          <h3 className='mt-3'>Curso vs Cantidad de Alumnos</h3>
          <h5 className='mt-3'>Cantidad de alumnos en el semestre {totalAlumnos}</h5>

        </div>
        
        <br />
        {chartBarReal == null ? "Cargando...":
              (chartBarReal.labels != null && chartBarReal.labels.length > 0 ? 
                <GraficaBarras chartData={chartBarReal}/> : 
                <div className="mt-5 align-items-center justify-content-center" style={{ height: '100vh' }}>
                  <h4 className="text-center">No hay informacion que mostrar</h4>
                </div>) 
              }
      </div>
    </div>

  )
}

export default TiempoReal
