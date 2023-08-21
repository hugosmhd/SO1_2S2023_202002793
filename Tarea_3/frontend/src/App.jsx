import { useState } from 'react'
import ShowProducts from './components/ShowProducts';
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Routes>
      <Route path="/">
        <Route index element={<ShowProducts block="true"/>} />
      </Route>

      {/* <Route path="/account" element={<AccountLayout />}>
        <Route path="profile" element={<Profile />} />
        <Route path="edit" element={<ProfileEdit />} />
      </Route> */}
    </Routes>
  )
}

export default App
