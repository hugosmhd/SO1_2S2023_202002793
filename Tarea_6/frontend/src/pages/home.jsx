import { useEffect, useState } from 'react'
import socket from '../socket/Socket'
import NavbarCustom from '../components/Navbar'

function Home() {

    const [albumes, setAlbumes] = useState([]);

      useEffect(() => {
    socket.on("getAllAlbums", (value) => {
      setAlbumes(value);
    });

    return () => {
    };
  }, []);

  const chunkArray = (arr, size) => {
    const result = [];
    for (let i = 0; i < arr.length; i += size) {
      result.push(arr.slice(i, i + size));
    }
    return result;
  };

  const chunkedAlbumes = chunkArray(albumes, 3);

  return (
    <div>
        <NavbarCustom></NavbarCustom>
        {albumes != null && chunkedAlbumes != null ? (
            <>
            <h1>Total de albumes: {albumes.length}</h1>
            {chunkedAlbumes.map((row, rowIndex) => (
                <div className="row" key={rowIndex}>
                  {row.map((item, index) => (
                    <div className="col-md-4" key={index}>
                      <div className="card text-bg-light mb-3">
                        <div className="card-header">Album: {item.album}</div>
                        <div className="card-body">
                          <h5 className="card-title">Artista: {item.artist}</h5>
                          <p className="card-text">
                            Año: {item.year}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </>
        ) : ("Cargando")}

  </div>
  );
}

export default Home;