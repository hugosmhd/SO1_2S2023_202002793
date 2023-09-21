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
import React,{ useEffect, useState, useMemo } from 'react';
import axios from './axios-config';
import { show_alerta } from '../functions';
import { GraficaCircular } from './GraficaCircular'
import { Line } from 'react-chartjs-2';
import NavbarCustom from './Navbar'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
  } from "chart.js";
  import DatePicker from 'react-datepicker';
  import 'react-datepicker/dist/react-datepicker.css';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
  );
  

var cout = 1;
const Historial = () => {
    // const url='http://localhost:8000';

    const [dataFromAPI, setDataFromAPI] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [opcionSeleccionada, setOpcionSeleccionada] = useState(0);
    const [maquinas, setMaquinas] = useState(null);
    const [options, setOptions] = useState(null);
    const [dataLine, setDataLine] = useState(null);
    const [dataLineRam, setDataLineRam] = useState(null);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    console.log("cambia", date);
  };

  const url='http://localhost:3000';

// const data = useMemo(function () {
//     return {
//       datasets: [
//         {
//           label: "Rendimiento de mi cpu",
//           data: scores,
//           tension: 0.3,
//           borderColor: "rgb(75, 192, 192)",
//           pointRadius: 6,
//           pointBackgroundColor: "rgb(75, 192, 192)",
//           backgroundColor: "rgba(75, 192, 192, 0.3)",
//         },
//         // {
//         //   label: "Mis datos (2)",
//         //   tension: 0.3,
//         //   data: scores2,
//         //   borderColor: "green",
//         // //   backgroundColor: "rgba(0, 255, 0, 0.3)",
//         //   pointRadius: 6,
//         // },
//       ],
//       labels,
//     };
//   }, []);

    
    // useEffect(() => {
    //     // handleDateChange(new Date())

    //     const fetchData = async () => {
    //       try {
    //         // const url_get_vm = url+"/fill/vm/"
    //         // const fill_vm = await axios.get(url_get_vm); // Reemplaza con la URL de tu API Node.js.
    //         const url_get = url+"/history/0"
    //         const response = await axios.get(url_get); // Reemplaza con la URL de tu API Node.js.
    //         // setMaquinas(fill_vm.data.maquinas)
    //         const options = {
    //             fill: true,
    //             responsive: true,
    //             scales: {
    //                 y: {
    //                 min: 0,
    //                 max: 100,
    //                 },
    //             },
    //             plugins: {
    //                 legend: {
    //                 display: true,
    //                 },
    //             },
    //         };
    //         setOptions(options)

    //         const new_data = {
    //           datasets: [
    //             {
    //               label: "Rendimiento de mi CPU",
    //               data: response.data.data_cpu,
    //               tension: 0.3,
    //               borderColor: "rgb(75, 192, 192)",
    //               pointRadius: 6,
    //               pointBackgroundColor: "rgb(75, 192, 192)",
    //               backgroundColor: "rgba(75, 192, 192, 0.3)",
    //             },
    //           ],
    //           labels: response.data.label,
    //         };
    //         setDataLine(new_data)

    //         const new_data_ram = {
    //           datasets: [
    //             {
    //               label: "Rendimiento de mi RAM",
    //               data: response.data.data_ram,
    //               tension: 0.3,
    //               borderColor: "green",
    //               backgroundColor: "rgba(0, 255, 0, 0.3)",
    //               pointRadius: 6,
    //             },
    //           ],
    //           labels: response.data.label,
    //         };
    //         setDataLineRam(new_data_ram)
            
    //         } catch (error) {
    //           console.error('Error al obtener datos desde la API Node.js:', error.message);
    //         }
    //     };
    //     fetchData()
    //         // createChart();
    //     //     setLabels(previous => {
    //     //         previous.shift();
    //     //         previous.push((new Date()).toLocaleTimeString());
    //     //         return previous;
    //     //     });
            
    //     //     setCpu(previous => {
    //     //         previous.shift();
    //     //         previous[9] = cpu_usage;
    //     //         return previous;
    //     //     });
    //     // const intervalId = setInterval(fetchData, 1500);

    //     // Puedes detener el intervalo cuando sea necesario (por ejemplo, al desmontar el componente).
    //     // return () => clearInterval(intervalId);
    // }, [])

    useEffect(() => {
      handleDateChange(new Date())

      const fetchData = async () => {
        // try {
        //   const url_get_vm = 'http://localhost:3000/fill/vm'; // Reemplaza con la URL correcta
        //   const fill_vm = await axios.get(url_get_vm);
          
        //   // Verifica si la respuesta es exitosa (código de estado 200)
        //   if (fill_vm.status === 200) {
        //     // setData(fill_vm.data); // Actualiza el estado con los datos
        //     console.log("Buenas");
        //     setMaquinas(fill_vm.data.maquinas)
        //   } else {
        //     console.error('La solicitud no fue exitosa. Código de estado:', fill_vm.status);
        //   }
        // } catch (error) {
        //   console.error('Error al obtener datos desde la API Node.js:', error.message);
        // }
        try {
          const url_get = url+"/history/"+opcionSeleccionada
          const response = await axios.get(url_get); // Reemplaza con la URL de tu API Node.js.
          setMaquinas(response.data.maquinas)
          
          // Verifica si la respuesta es exitosa (código de estado 200)
          if (response.status === 200) {
            // setData(response.data); // Actualiza el estado con los datos
            const options = {
              fill: true,
              responsive: true,
              scales: {
                  y: {
                  min: 0,
                  max: 100,
                  },
              },
              plugins: {
                  legend: {
                  display: true,
                  },
              },
          };
          setOptions(options)
  
          const new_data = {
            datasets: [
              {
                label: "Rendimiento de mi CPU",
                data: response.data.data_cpu,
                tension: 0.3,
                borderColor: "rgb(75, 192, 192)",
                pointRadius: 6,
                pointBackgroundColor: "rgb(75, 192, 192)",
                backgroundColor: "rgba(75, 192, 192, 0.3)",
              },
            ],
            labels: response.data.label,
          };
          setDataLine(new_data)
  
          const new_data_ram = {
            datasets: [
              {
                label: "Rendimiento de mi RAM",
                data: response.data.data_ram,
                tension: 0.3,
                borderColor: "green",
                backgroundColor: "rgba(0, 255, 0, 0.3)",
                pointRadius: 6,
              },
            ],
            labels: response.data.label,
          };
          setDataLineRam(new_data_ram)
          } else {
            console.error('La solicitud no fue exitosa. Código de estado:', response.status);
          }
        } catch (error) {
          console.error('Error al obtener datos desde la API Node.js:', error.message);
        }
      };
  
      fetchData();
    }, [opcionSeleccionada]); // El segundo argumento [] indica qu
    
    const handleSelectChange = (event) => {
      const valorSeleccionado = event.target.value;
      setOpcionSeleccionada(valorSeleccionado);
      console.log(valorSeleccionado);
    };

  return (
      <div block="true" className='mb-6'>
        <NavbarCustom />
        <div className="container mt-4">
            <Form.Select size="lg" onChange={handleSelectChange} value={opcionSeleccionada}>
            {maquinas != null ? (
              maquinas.map((maquina, i) => (
                <option key={i} value={i}>
                  Maquina {i+1} - <strong>{maquina.nombre}</strong>
                </option>
              ))
            ) : (
              <option value="2">Cargando</option>
            )}
            </Form.Select>
        </div>
        <div className="container mt-4">
            
            <div className="row">
                <div className="col-8">
                    <p className="text-center"><strong>Monitor de CPU</strong></p>
                    { dataLine != null ?
                      <Line data={dataLine} options={options} /> : "cargando"
                    }
                    
                </div>
                <div className="col-3 mt-5">
                    <strong>Fecha de Busqueda:</strong>
                    <div>
                    <DatePicker
                        selected={selectedDate}
                        onChange={handleDateChange}
                        dateFormat="dd/MM/yyyy" // Formato de fecha (puedes personalizarlo)
                    />
                    {selectedDate && (
                        <p>Fecha seleccionada: {selectedDate.toLocaleDateString()}</p>
                    )}
                    </div>
                </div>
            </div>

        </div>
        <div className="container mt-4">
            <div className="row">
                <div className="col-8">
                    <p className="text-center"><strong>Monitor de RAM</strong></p>
                    { dataLineRam != null ?
                      <Line data={dataLineRam} options={options} /> : "cargando"
                    }
                    
                </div>
                <div className="col-3 mt-5">
                    <strong>Fecha de Busqueda:</strong>
                    <div>
                    <DatePicker
                        selected={selectedDate}
                        onChange={handleDateChange}
                        dateFormat="dd/MM/yyyy" // Formato de fecha (puedes personalizarlo)
                    />
                    {selectedDate && (
                        <p>Fecha seleccionada: {selectedDate.toLocaleDateString()}</p>
                    )}
                    </div>
                </div>
            </div>
            
            {/* <h2>Historial...</h2>
            <Line data={data} options={options} />
            <Line data={data} options={options} /> */}
        </div>
    </div>
    
  )
}

export default Historial
