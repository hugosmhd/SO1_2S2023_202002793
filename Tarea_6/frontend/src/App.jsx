import { useState } from 'react'
import Home from './pages/home';
import { Routes, Route, Navigate } from 'react-router-dom';

function App() {
  return (
    <Routes>
      <Route path="/">
        <Route path="home" element={<Home />} />
        <Route index element={<Navigate to="/home" />} />
      </Route>
    </Routes>
  )
}

export default App

// import { useEffect, useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'
// import socket from './socket/Socket'
// import NavbarCustom from './components/Navbar'

// function App() {
//   const [count, setCount] = useState(0)
//   const [lastGames, setLastGames] = useState([]);

//   useEffect(() => {
//     socket.on("getAllAlbums", (value) => {
//       setLastGames(value);
//     });

//     return () => {
//       // This is the cleanup function
//     };
//   }, []);

//   return (
//     <>
//     <NavbarCustom></NavbarCustom>
//       datos 
//       <pre>
//         <code>{JSON.stringify(lastGames, null, 2)}</code>
//       </pre>
//     </>
//   )
// }

// export default App
