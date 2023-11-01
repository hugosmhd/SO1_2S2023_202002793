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
    barThickness: 80 // establece el ancho de las barras en 20 px
};



export function GraficaBarras({ chartData }) {
    const colores = [
        'rgba(255, 99, 132, 1)', // Color de la primera barra
        'rgba(54, 162, 235, 1)', // Color de la segunda barra
        'rgba( 212, 172, 13, 1)',
        'rgba(20, 143, 119, 1)',
        'rgba(203, 67, 53, 1)'
        // Agrega más colores según la cantidad de barras necesarias
    ];
    chartData.datasets[0].backgroundColor = colores;
    chartData.datasets[0].indexAxis = 'y';
  return <Bar data={chartData} options={misoptions}/>;
}