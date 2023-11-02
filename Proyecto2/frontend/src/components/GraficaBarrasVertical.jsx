import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

var misoptions = {
    animation: true,
    plugins : {
        legend : {
            display : false
        }
    },
};



export function GraficaBarrasVertical({ chartData }) {
    const colores = [
        'rgba(255, 99, 132, 1)', // Color de la primera barra
        'rgba(54, 162, 235, 1)', // Color de la segunda barra
        'rgba( 212, 172, 13, 1)'
        // Agrega más colores según la cantidad de barras necesarias
    ];
    chartData.datasets[0].backgroundColor = colores;
  return <Bar data={chartData} options={misoptions}/>;
}