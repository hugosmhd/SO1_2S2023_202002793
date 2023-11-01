import { useState } from 'react'
import TiempoReal from './components/TiempoReal';
import { Routes, Route, Navigate } from 'react-router-dom';
import ReportesMysql from './components/ReportesMysql';

function App() {
  return (
    <Routes>
      <Route path="/">
        <Route path="tiempo-real" element={<TiempoReal block="true"/>} />
        <Route path="reportes-mysql" element={<ReportesMysql block="true"/>} />
        <Route index element={<Navigate to="/tiempo-real" />} />
      </Route>
    </Routes>
  )
}

export default App
