import { Table, Container, Row, Col, Form, Button, Card, Navbar } from 'react-bootstrap';
import './styles.css';

import React, { useEffect, useState } from 'react';
import axios from './axios-config';
import PaginatedTable from "./Table";
import NavbarCustom from './Navbar'
import { GraficaCircular } from './GraficaCircular';
import { GraficaBarrasVertical } from './GraficaBarrasVertical';


const ReportesMysql = () => {
    const headers = ['ID', 'Carnet', 'Alumno', 'Curso', 'Nota', 'Semestre', 'Year']
    
  const [seleccionSemestreAprobacion, setSeleccionSemestreAprobacion] = useState("1S");
  const [seleccionSemestrePromedio, setSeleccionSemestrePromedio] = useState("1S");
  const [seleccionSemestreAlumnos, setSeleccionSemestreAlumnos] = useState("1S");
  const [seleccionCursoAprobacion, setSeleccionCursoAprobacion] = useState("SO1");
  const [refresh, setRefresh] = useState(true);

  const [chartAprobacion, setChartAprobacion] = useState(null);
  const [chartBarPromedio, setCharBarPromedio] = useState(null);
  const [chartBarAlumnos, setCharBarAlumnos] = useState(null);
  const [totalDatos, setTotalDatos] = useState(0)
  const [data, setData] = useState([])

  const url = 'http://34.41.203.179:3000';
  // const url = 'http://localhost:3000';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url_get = url + `/tabla-datos`
        const response = await axios.get(url_get); // Reemplaza con la URL de tu API Node.js.

        // Verifica si la respuesta es exitosa (código de estado 200)
        if (response.status === 200) {
          setTotalDatos(response.data.all_data.length)
          setData(response.data.all_data)
        }
      } catch (error) {
        console.error('Error al obtener datos desde la API Node.js:', error.message);
      }
      try {
        const url_get = url + `/primer-grafica?parametro1=${seleccionCursoAprobacion}
        &parametro2=${seleccionSemestreAprobacion}`
        const response = await axios.get(url_get); // Reemplaza con la URL de tu API Node.js.
        // Verifica si la respuesta es exitosa (código de estado 200)
        if (response.status === 200) {
          // Procesa la respuesta del servidor
            const chart_aprobacion = {
              labels: ['Aprobados', 'Reprobados'],
              datasets: [
                {
                  data: [response.data.primer_grafica.ganaron, response.data.primer_grafica.perdieron],
                  backgroundColor: [
                    'rgba(35, 155, 86, 0.2)',
                    'rgba(255, 99, 132, 0.2)',
                  ],
                  borderColor: [
                    'rgba(35, 155, 86, 1)',
                    'rgba(255, 99, 132, 1)',
                  ],
                  borderWidth: 1,
                },
              ],
            };
            setChartAprobacion(chart_aprobacion);
        }
      } catch (error) {
        console.error('Error al obtener datos desde la API Node.js:', error.message);
      }
      try {
        const url_get = url + `/segunda-grafica?parametro1=${seleccionSemestrePromedio}`
        const response = await axios.get(url_get); // Reemplaza con la URL de tu API Node.js.

        // Verifica si la respuesta es exitosa (código de estado 200)
        if (response.status === 200) {
          // Procesa la respuesta del servidor
          const chart_promedio = {
            labels: response.data.segunda_grafica.mejor_promedio.labels,
            datasets: [
                {
                    data: response.data.segunda_grafica.mejor_promedio.valores
                }
            ]
          };
          setCharBarPromedio(chart_promedio);
        }
      } catch (error) {
        console.error('Error al obtener datos desde la API Node.js:', error.message);
      }
      try {
        const url_get = url + `/tercer-grafica?parametro1=${seleccionSemestreAlumnos}`
        const response = await axios.get(url_get); // Reemplaza con la URL de tu API Node.js.
        console.log(response.data);
        // Verifica si la respuesta es exitosa (código de estado 200)
        if (response.status === 200) {
          // Procesa la respuesta del servidor
          const chart_alumnos = {
            labels: response.data.tercer_grafica.mayor_alumnos.labels,
            datasets: [
                {
                    data: response.data.tercer_grafica.mayor_alumnos.valores
                }
            ]
          };
          setCharBarAlumnos(chart_alumnos);
        }
      } catch (error) {
        console.error('Error al obtener datos desde la API Node.js:', error.message);
      }
      
    }; 

    fetchData()
  }, [refresh]);

  const handleSelectChange = (event) => {
    const valorSeleccionado = event.target.value;
    setSeleccionSemestreAprobacion(valorSeleccionado);
    // console.log(valorSeleccionado);
  };

  const handleSelectChangeCursoApr = (event) => {
    const valorSeleccionado = event.target.value;
    setSeleccionCursoAprobacion(valorSeleccionado);
    // console.log(valorSeleccionado);
  };

  const handleSelectChangeSemestreProm = async (event) => {
    const valorSeleccionado = event.target.value;
    setSeleccionSemestrePromedio(valorSeleccionado);
    // console.log(valorSeleccionado);
    console.log("Consultar");
    setCharBarPromedio(null)
      try {
        const url_get = url + `/segunda-grafica?parametro1=${valorSeleccionado}`
        const response = await axios.get(url_get); // Reemplaza con la URL de tu API Node.js.

        // Verifica si la respuesta es exitosa (código de estado 200)
        if (response.status === 200) {
          // Procesa la respuesta del servidor
          const chart_promedio = {
            labels: response.data.segunda_grafica.mejor_promedio.labels,
            datasets: [
                {
                    data: response.data.segunda_grafica.mejor_promedio.valores
                }
            ]
          };
          setCharBarPromedio(chart_promedio);
        }
      } catch (error) {
        console.error('Error al obtener datos desde la API Node.js:', error.message);
      }
  };

  const handleSelectChangeSemestreAlum = async (event) => {
    const valorSeleccionado = event.target.value;
    setSeleccionSemestreAlumnos(valorSeleccionado);
    // console.log(valorSeleccionado);
    console.log("Consultar");
    setCharBarAlumnos(null)
      try {
        const url_get = url + `/tercer-grafica?parametro1=${valorSeleccionado}`
        const response = await axios.get(url_get); // Reemplaza con la URL de tu API Node.js.
        console.log(response.data);
        // Verifica si la respuesta es exitosa (código de estado 200)
        if (response.status === 200) {
          // Procesa la respuesta del servidor
          const chart_alumnos = {
            labels: response.data.tercer_grafica.mayor_alumnos.labels,
            datasets: [
                {
                    data: response.data.tercer_grafica.mayor_alumnos.valores
                }
            ]
          };
          setCharBarAlumnos(chart_alumnos);
        }
      } catch (error) {
        console.error('Error al obtener datos desde la API Node.js:', error.message);
      }
  };

  const handleQueryFirstButtonClick = async () => {
    console.log("Consultar");
    setChartAprobacion(null)
      try {
        const url_get = url + `/primer-grafica?parametro1=${seleccionCursoAprobacion}
        &parametro2=${seleccionSemestreAprobacion}`
        const response = await axios.get(url_get); // Reemplaza con la URL de tu API Node.js.

        // Verifica si la respuesta es exitosa (código de estado 200)
        if (response.status === 200) {
          // Procesa la respuesta del servidor
            const chart_aprobacion = {
              labels: ['Aprobados', 'Reprobados'],
              datasets: [
                {
                  data: [response.data.primer_grafica.ganaron, response.data.primer_grafica.perdieron],
                  backgroundColor: [
                    'rgba(35, 155, 86, 0.2)',
                    'rgba(255, 99, 132, 0.2)',
                  ],
                  borderColor: [
                    'rgba(35, 155, 86, 1)',
                    'rgba(255, 99, 132, 1)',
                  ],
                  borderWidth: 1,
                },
              ],
            };
            setChartAprobacion(chart_aprobacion);
        }
      } catch (error) {
        console.error('Error al obtener datos desde la API Node.js:', error.message);
      }
  }

  const handleRefreshBtnClick = async () => {
    setData([])
    setChartAprobacion(null)
    setCharBarPromedio(null)
    setCharBarAlumnos(null)
    setRefresh(!refresh)
  }


  return (
    <div block="true" className='mb-6'>
      <NavbarCustom />
      <div className="container mt-4">
      <div className="d-flex justify-content-between mb-3">
        <h3>MYSQL</h3>
        <Button variant="success" onClick={() => handleRefreshBtnClick()}>Recargar</Button>
        <h5>Cantidad de Datos: {totalDatos}</h5>
      </div>
      <div className="text-center">
        <h3>Datos almacenados</h3>
      </div>
      <PaginatedTable data={data} itemsPerPage={10} headers={headers}/>
      </div>

      <div className="container">
      <div className="row">
        <div className="col-sm-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Porcentaje de aprobacion en Curso</h5>
              <div className="row">
        <div className="col-md-6">
          <p>Curso</p>
        <Form.Select size="lg" onChange={handleSelectChangeCursoApr} value={seleccionCursoAprobacion}>
            <option value="SO1">SO1</option>
            <option value="BD1">BD1</option>
            <option value="LFP">LFP</option>
            <option value="SA">SA</option>
            <option value="AYD1">AYD1</option>
        </Form.Select>
        </div>
        <div className="col-md-6">
          <p>Semestre</p>
        <Form.Select size="lg" onChange={handleSelectChange} value={seleccionSemestreAprobacion}>
            <option value="1S">1er Semestre - 1S</option>
            <option value="2S">2do Semestre - 2S</option>
        </Form.Select>
        </div>
      </div>
      <div className="d-flex align-items-center justify-content-center mt-3">
        <button 
          className="btn btn-primary btn-lg"
          onClick={() => handleQueryFirstButtonClick()}
          >Consultar</button>
        
      </div>

              {/* {chartAprobacion != null ?
              (<GraficaCircular chartData={chartAprobacion} />) : "Cargando..."
              } */}
              {chartAprobacion == null || chartAprobacion.datasets[0] == null ? "Cargando...":
              (chartAprobacion.datasets[0].data[0] > 0 && chartAprobacion.datasets[0].data[1] > 0 ? 
                <GraficaCircular chartData={chartAprobacion}/> : 
                <div className="mt-5 align-items-center justify-content-center" style={{ height: '100vh' }}>
                  <h4 className="text-center">No hay informacion que mostrar</h4>
                </div>) 
              }
            </div>
          </div>
        </div>
        <div className="col-sm-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Alumnos con mejor Promedio</h5>
              <div style={{height: '300px' }}>
              <p>Semestre</p>
              <Form.Select className='mb-3' size="lg" onChange={handleSelectChangeSemestreProm} value={seleccionSemestrePromedio}>
                  <option value="1S">1er Semestre - 1S</option>
                  <option value="2S">2do Semestre - 2S</option>
              </Form.Select>

              {/* {chartBarPromedio != null ?
              (<GraficaBarrasVertical chartData={chartBarPromedio}/>) : "Cargando..."
              
            } */}
            {chartBarPromedio == null ? "Cargando...":
              (chartBarPromedio.labels != null && chartBarPromedio.labels.length > 0 ? 
                <GraficaBarrasVertical chartData={chartBarPromedio}/> : 
                <div className="mt-5 align-items-center justify-content-center" style={{ height: '100vh' }}>
                  <h4 className="text-center">No hay informacion que mostrar</h4>
                </div>) 
              }
            </div>
              
            </div>
          </div>
        </div>
        <div className="col-sm-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Cursos con Mayor numero de alumnos</h5>
              <div style={{height: '300px' }}>
              <p>Semestre</p>
              <Form.Select size="lg" onChange={handleSelectChangeSemestreAlum} value={seleccionSemestreAlumnos}>
                  <option value="1S">1er Semestre - 1S</option>
                  <option value="2S">2do Semestre - 2S</option>
              </Form.Select>
              {chartBarAlumnos == null ? "Cargando...":
              (chartBarAlumnos.labels != null && chartBarAlumnos.labels.length > 0 ? 
                <GraficaBarrasVertical chartData={chartBarAlumnos}/> : 
                <div className="mt-5 align-items-center justify-content-center" style={{ height: '100vh' }}>
                  <h4 className="text-center">No hay informacion que mostrar</h4>
                </div>) 
              }

              {/* <GraficaBarrasVertical chartData={chartBarAlumnos}/> */}
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>

  )
}

export default ReportesMysql
