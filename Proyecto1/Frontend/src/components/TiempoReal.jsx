import { Table, Container, Row, Col, Form, Button, Card, Navbar } from 'react-bootstrap';
import Accordion from 'react-bootstrap/Accordion';
import './styles.css';

import React, { useEffect, useState } from 'react';
import axios from './axios-config';
import { GraficaCircular } from './GraficaCircular'
import NavbarCustom from './Navbar'

const TiempoReal = () => {

  const [dataFromAPI, setDataFromAPI] = useState(null);
  const [opcionSeleccionada, setOpcionSeleccionada] = useState(0);
  const [maquinas, setMaquinas] = useState(null);
  const [procesos, setProcesos] = useState([]);
  const [chartCPU, setChartCPU] = useState(null);
  const [chartRAM, setChartRAM] = useState(null);
  const [totalRam, setTotalRam] = useState({ totalRam: 1 });
  const [usuarios, setUsuarios] = useState([])
  const [tablaUsuarios, setTablaUsuarios] = useState([])
  const [busqueda, setBusqueda] = useState("")
  const [isBusqueda, setIsBusqueda] = useState(false)

  const url = 'http://35.209.27.165:3000';
  // const url = 'http://localhost:3000';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url_get = url + "/" + opcionSeleccionada
        const response = await axios.get(url_get); // Reemplaza con la URL de tu API Node.js.
        setDataFromAPI(response.data);
        setProcesos(response.data.data_cpu.procesos);

        const arreglo_busquedas = []
        response.data.data_cpu.procesos.map((proceso, i) => {
          arreglo_busquedas.push(proceso)
          proceso.hijos.map((hijo, i) => {
            arreglo_busquedas.push(hijo)
          })
        })
        // setTablaUsuarios(arreglo_busquedas);
        setUsuarios(arreglo_busquedas)
        console.log(response.data.data_cpu.procesos);
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
        setTotalRam(total_ram);
        setMaquinas(response.data.maquinas)
      } catch (error) {
        console.error('Error al obtener datos desde la API Node.js:', error.message);
      }
    };

    // Realiza la primera solicitud de inmediato.
    fetchData();

    // Configura un intervalo para realizar solicitudes cada 5 segundos.
    const intervalId = setInterval(fetchData, 1500);

    // Puedes detener el intervalo cuando sea necesario (por ejemplo, al desmontar el componente).
    return () => clearInterval(intervalId);
  }, [opcionSeleccionada]);

  const handleKillButtonClick = async (id) => {
    try {
      // Realiza las acciones que deseas con el ID aquí
      const url_kill = url + '/kill/' + id
      console.log("Botón Kill presionado con el ID:", id);
      console.log(url_kill);
      const response = await axios.get(url_kill); // Reemplaza con la URL de tu API Node.js.
      setProcesos(response.data.data_cpu.procesos);
      const arreglo_busquedas = []
      response.data.data_cpu.procesos.map((proceso, i) => {
        arreglo_busquedas.push(proceso)
        proceso.hijos.map((hijo, i) => {
          arreglo_busquedas.push(hijo)
        })
      })
      setUsuarios(arreglo_busquedas)

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
      setTotalRam(total_ram);
      filtrar(busqueda)
      // Puedes llamar a otras funciones o realizar cambios en el estado aquí
    } catch (error) {
      // Manejo de errores
      console.error('Error al obtener datos desde la API Node.js:', error.message);
    }
  };

  const handleSelectChange = (event) => {
    const valorSeleccionado = event.target.value;
    setOpcionSeleccionada(valorSeleccionado);
    console.log(valorSeleccionado);
    setChartCPU(null)
    setChartRAM(null)
    setDataFromAPI(null)
    setProcesos(null)
  };

  const handleInputChange = (event) => {
    setBusqueda(event.target.value)
    console.log("Busqueda: ", event.target.value);
    filtrar(event.target.value);
    if (event.target.value != "") {
      setIsBusqueda(true);
    } else {
      setIsBusqueda(false);
    }
  }

  const filtrar = (termBusqueda) => {
    var resultadosBuscados = usuarios.filter((elemento) => {
      if ((elemento.pid != undefined &&
        elemento.pid.toString().toLowerCase().includes(termBusqueda.toLowerCase()))
        || (elemento.nombre != undefined &&
          elemento.nombre.toString().toLowerCase().includes(termBusqueda.toLowerCase()))
      ) {
        return elemento
      }
    });
    setTablaUsuarios(resultadosBuscados)
  }

  return (
    <div block="true" className='mb-6'>
      <NavbarCustom />
      <div className="container mt-4">
        <Form.Select size="lg" onChange={handleSelectChange} value={opcionSeleccionada}>
          {maquinas != null ? (
            maquinas.map((maquina, i) => (
              <option key={i} value={i}>
                Maquina {i + 1} - <strong>{maquina.nombre}</strong>
              </option>
            ))
          ) : (
            <option value="2">Cargando</option>
          )}
        </Form.Select>
        <Row className="justify-content-center">
          <Col md={3}>
            {chartCPU != null ?
              <GraficaCircular chartData={chartCPU} /> : "cargando"
            }
          </Col>
          <Col md={3}>
            {chartRAM != null ?
              <GraficaCircular chartData={chartRAM} /> : "cargando"

            }
          </Col>
        </Row>
        <br />
        <div className="d-flex justify-content-center">
          <h3>PID</h3>
          <Form className="d-flex align-items-center ms-3">
            <Form.Control
              type="search"
              placeholder="Search"
              className="me-2"
              aria-label="Search"
              onChange={handleInputChange}
            />

          </Form>
        </div>
        <h3>Procesos</h3>
        <hr />

        {/* {dataFromAPI != null && dataFromAPI.data_cpu != null && dataFromAPI.data_cpu.procesos != null > 0 ? dataFromAPI.data_cpu.procesos.map( (proceso,i)=>( */}
        {procesos != null && !isBusqueda ? procesos.map((proceso, i) => (
          <Accordion>
            <Accordion.Item eventKey="0">
              <Accordion.Header>Proceso: {proceso.nombre}</Accordion.Header>
              <Accordion.Body>
                <Table striped text-center bordered hover className="text-center">
                  <thead>
                    <tr>
                      <th colSpan={6} style={{ backgroundColor: '#FF5733', color: 'white' }}>Proceso</th>
                    </tr>
                    <tr>
                      <th>PID</th>
                      <th>Nombre</th>
                      <th>Usuario</th>
                      <th>Estado</th>
                      <th>%RAM</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr key={i + 1}>
                      <td>{proceso.pid}</td>
                      <td>{proceso.nombre}</td>
                      <td>{proceso.user_id}</td>
                      <td>{proceso.estado}</td>
                      <td>{(proceso.ram_consumo * 100 / totalRam).toFixed(2)}</td>
                      <td>
                        <Button
                          variant="outline-danger"
                          onClick={() => handleKillButtonClick(proceso.pid)}
                        >
                          Kill
                        </Button>
                      </td>
                    </tr>

                  </tbody>
                  <thead>
                    <tr>
                      <th colSpan={6} style={{ backgroundColor: ' #58d68d ', color: 'white' }}>Procesos hijos</th>
                    </tr>
                    <tr>
                      <th>PID</th>
                      <th>Nombre</th>
                      <th>Usuario</th>
                      <th>Estado</th>
                      <th>%RAM</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {proceso.hijos.map((hijo, i) => (
                      <tr key={i + 1}>
                        <td>{hijo.hijo_pid}</td>
                        <td>{hijo.hijo_nombre}</td>
                        <td>{proceso.user_id}</td>
                        <td>{hijo.estado}</td>
                        <td>{(hijo.ram_consumo * 100 / totalRam).toFixed(2)}</td>
                        <td>
                          <Button
                            variant="outline-danger"
                            onClick={() => handleKillButtonClick(hijo.hijo_pid)}
                          >
                            Kill
                          </Button>
                        </td>
                      </tr>
                    ))
                    }
                  </tbody>
                </Table>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        )) : (
          procesos != null && isBusqueda ? (

            <Table striped text-center bordered hover className="text-center">
              <thead>
                <tr>
                  <th colSpan={5} style={{ backgroundColor: '#FF5733', color: 'white' }}>Proceso</th>
                </tr>
                <tr>
                  <th>PID</th>
                  <th>Nombre</th>
                  <th>Estado</th>
                  <th>%RAM</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {
                  tablaUsuarios.map((proceso, i) => (
                    <tr key={i + 1}>
                      <td>{proceso.pid != undefined ? proceso.pid : proceso.hijo_pid}</td>
                      <td>{proceso.nombre != undefined ? proceso.nombre : proceso.hijo_nombre}</td>
                      <td>{proceso.estado}</td>
                      <td>{(proceso.ram_consumo * 100 / totalRam).toFixed(2)}</td>
                      <td>
                        <Button
                          variant="outline-danger"
                          onClick={() => handleKillButtonClick(proceso.pid)}
                        >
                          Kill
                        </Button>
                      </td>
                    </tr>

                  ))}
              </tbody>
            </Table>
          )
            : "Cargando"
        )
        }

      </div>
    </div>

  )
}

export default TiempoReal
