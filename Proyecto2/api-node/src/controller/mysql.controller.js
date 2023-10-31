import { connection } from "../db/mysql.db.js";
import mysql from 'mysql2/promise'; // Importa la versión Promise de mysql2

const getAllUsers = () => {
  return new Promise((resolve, reject) => {
    const consultaAllUsers = `
    SELECT * FROM Alumnos
  `;

  // Ejecuta la consulta SQL
  connection.query(consultaAllUsers, (error, resultados) => {
    if (error) {
      console.error('Error en la consulta: ' + error);
      reject(error);
    } else {
      resolve(resultados);
    }
  })
  });
};

const getSpecificCursoSemestre = (curso, semestre, carnet) => {
  return new Promise((resolve, reject) => {
    const consulta = 'SELECT nota FROM Notas WHERE alumno_carnet = ? AND curso_nombre = ? AND semestre = ?';

    // Ejecuta la consulta SQL
    connection.query(consulta, [carnet, curso, semestre], (error, resultados) => {
      if (error) {
        console.error('Error en la consulta: ' + error);
        reject(error);
      } else {
        // console.log(resultados);
        resolve(resultados);
      }
    });
  });
};

const getAprobacion = async(all_users) => {
  let ganaron = 0
  let perdieron = 0
  try {
    console.log("*************************************************************************");
    for (const usuario of all_users) {
      let promedio = 0;
      const curso = 'AYD1'; // Reemplaza con el nombre del curso
      const semestre = '1S'; // Reemplaza con el semestre deseado
      const carnet = usuario.carnet; // Supongamos que el carnet del usuario está almacenado en cada objeto de usuario
      // console.log(carnet);
      // // Realiza la consulta para obtener las notas del usuario en el curso y semestre especificados
      const notas = await getSpecificCursoSemestre(curso, semestre, carnet)
      for (const nota of notas) {
        promedio += parseFloat(nota.nota / notas.length)
      }
      // console.log(promedio);
      if(promedio >= 61) ganaron++
      else perdieron++
    }
  } catch (error) {
    console.error('Error al ejecutar la consulta: ' + error);
  }

  // console.log("Ganaron: ", ganaron);
  // console.log("Perdieron: ", perdieron);
  return {
    "ganaron": ganaron,
    "perdieron": perdieron
  }

}


const getDataMysql = async() => {
  const all_users = await getAllUsers()
  const primer_grafica = await getAprobacion(all_users)
  console.log(primer_grafica);
  

  return new Promise((resolve, reject) => {
    const sqlQueryOne = `
      SELECT N.nota_id, A.carnet AS carnet_alumno, A.nombre AS nombre_alumno, C.curso_nombre, N.nota, N.semestre, N.year
      FROM Notas N
      JOIN Alumnos A ON N.alumno_carnet = A.carnet
      JOIN Cursos C ON N.curso_nombre = C.curso_nombre
      ORDER BY N.nota_id ASC
    `;

    connection.query(sqlQueryOne, (error, results, fields) => {
      if (error) {
        console.error('Error en la consulta: ' + error);
        reject(error);
      } else {
        resolve({
          primer_grafica,
          results,
        });
      }
    });
  });
};

  export { getDataMysql };