import { useState } from 'react'
import ShowProducts from './components/ShowProducts';
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Routes>
      <Route path="/">
        <Route index element={<ShowProducts block="true"/>} />
      </Route>
    </Routes>
  )
}

export default App
