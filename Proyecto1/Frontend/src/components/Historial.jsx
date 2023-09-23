import { Form } from 'react-bootstrap';
import './styles.css';
import React, { useEffect, useState, useMemo } from 'react';
import axios from './axios-config';
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


const Historial = () => {

  const [dataFromAPI, setDataFromAPI] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [opcionSeleccionada, setOpcionSeleccionada] = useState(0);
  const [maquinas, setMaquinas] = useState(null);
  const [options, setOptions] = useState(null);
  const [dataLine, setDataLine] = useState(null);
  const [dataLineRam, setDataLineRam] = useState(null);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const url = 'http://35.209.27.165:3000';
  // const url = 'http://localhost:3000';

  useEffect(() => {
    handleDateChange(new Date())

    const fetchData = async () => {
      try {
        const url_get = url + "/history/" + opcionSeleccionada
        const response = await axios.get(url_get); // Reemplaza con la URL de tu API Node.js.

        // Verifica si la respuesta es exitosa (código de estado 200)
        if (response.status === 200) {
          setMaquinas(response.data.maquinas)
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
    setDataLine(null)
    setDataLineRam(null)
  };

  return (
    <div block="true" className='mb-6'>
      <NavbarCustom />
      <div className="container mt-4">
        <Form.Select size="lg" onChange={handleSelectChange} value={opcionSeleccionada}>
          {maquinas != null ? (
            maquinas.map((maquina, i) => (
              <option key={i} value={i}>
                Maquina {i + 1} - {maquina.nombre}
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
            {dataLine != null ?
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
            {dataLineRam != null ?
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
      </div>
    </div>

  )
}

export default Historial
