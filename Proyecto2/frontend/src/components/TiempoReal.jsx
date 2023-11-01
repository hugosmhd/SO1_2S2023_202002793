import { Table, Container, Row, Col, Form, Button, Card, Navbar } from 'react-bootstrap';
import './styles.css';

import React, { useEffect, useState } from 'react';
import axios from './axios-config';
import socket from '../socket/Socket'
import { GraficaBarras } from "./GraficaBarras";
import NavbarCustom from './Navbar'


const TiempoReal = () => {
    
  const [dataFromAPI, setDataFromAPI] = useState(null);
  const [seleccionSemestre, setSeleccionSemestre] = useState(1);
  const [maquinas, setMaquinas] = useState(null);
  const [procesos, setProcesos] = useState([]);
  const [chartCPU, setChartCPU] = useState(null);
  const [chartBarReal, setChartBarReal] = useState(null);
  const [totalRam, setTotalRam] = useState({ totalRam: 1 });
  const [usuarios, setUsuarios] = useState([])
  const [tablaUsuarios, setTablaUsuarios] = useState([])
  const [busqueda, setBusqueda] = useState("")
  const [isBusqueda, setIsBusqueda] = useState(false)
  const [totalDatos, setTotalDatos] = useState(0)
  const [cursos, setCursos] = useState([])
  const [cantidadAlumnos, setCantidadAlumnos] = useState([])

  const url = 'http://34.31.77.161:3000';
  // const url = 'http://localhost:3000';
  useEffect(() => {
    socket.on("getDataRedis", (value) => {
      setTotalDatos(value.suma_contadores)
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
      // console.log(response.data);
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
        <h5>Cantidad de Datos: {totalDatos}</h5>
      </div>


        <Form.Select size="lg" onChange={handleSelectChange} value={seleccionSemestre}>
            <option value="1">1er Semestre - 1S</option>
            <option value="2">2do Semestre - 2S</option>
        </Form.Select>
        <h3 className='mt-3'>Curso vs Cantidad de Alumnos</h3>
        
        <br />
        {chartBarReal != null ?
        (<GraficaBarras chartData={chartBarReal}/>) :
        "Cargando..."}
      </div>
    </div>

  )
}

export default TiempoReal
