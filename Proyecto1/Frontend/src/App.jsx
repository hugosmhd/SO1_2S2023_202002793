import { useState } from 'react'
import TiempoReal from './components/TiempoReal';
import Historial from './components/Historial';
import { Routes, Route, Navigate } from 'react-router-dom';

function App() {
  return (
    <Routes>
      <Route path="/">
        <Route path="tiempo-real" element={<TiempoReal block="true"/>} />
        <Route path="historial" element={<Historial />} />
        <Route index element={<Navigate to="/tiempo-real" />} />
      </Route>
    </Routes>
  )
}

export default App
