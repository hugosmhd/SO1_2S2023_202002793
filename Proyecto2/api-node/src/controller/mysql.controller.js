import { connection } from "../db/mysql.db.js";

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

const getAllCourses = () => {
  return new Promise((resolve, reject) => {
    const consultaAllUsers = `
    SELECT * FROM Cursos
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
        resolve(resultados);
      }
    });
  });
};

const getSpecificSemestre = (semestre, carnet) => {
  return new Promise((resolve, reject) => {
    const consulta = `SELECT N.nota, A.nombre AS nombre_alumno
    FROM Notas AS N
    INNER JOIN Alumnos AS A ON N.alumno_carnet = A.carnet
    WHERE alumno_carnet = ? AND semestre = ?`;

    // Ejecuta la consulta SQL
    connection.query(consulta, [carnet, semestre], (error, resultados) => {
      if (error) {
        console.error('Error en la consulta: ' + error);
        reject(error);
      } else {
        resolve(resultados);
      }
    });
  });
};

const getAlumnosSpecificSemestre = (semestre, curso) => {
  return new Promise((resolve, reject) => {
    const consulta = `
    SELECT alumno_carnet, curso_nombre, semestre, MAX(nota) AS nota
    FROM Notas
    WHERE curso_nombre = ? AND semestre = ?
    GROUP BY alumno_carnet, curso_nombre, semestre
  `;

    // Ejecuta la consulta SQL
    connection.query(consulta, [curso, semestre], (error, resultados) => {
      if (error) {
        console.error('Error en la consulta: ' + error);
        reject(error);
      } else {
        resolve(resultados);
      }
    });
  });
};

const getAprobacion = async(all_users, curso_apr, sem_apr) => {
  let ganaron = 0
  let perdieron = 0
  try {
    for (const usuario of all_users) {
      let promedio = 0;
      // // const curso = 'AYD1'; // Reemplaza con el nombre del curso
      // // const semestre = '1S'; // Reemplaza con el semestre deseado
      const curso = curso_apr; // Reemplaza con el nombre del curso
      const semestre = sem_apr; // Reemplaza con el semestre deseado
      const carnet = usuario.carnet; // Supongamos que el carnet del usuario está almacenado en cada objeto de usuario
      // // Realiza la consulta para obtener las notas del usuario en el curso y semestre especificados
      const notas = await getSpecificCursoSemestre(curso, semestre, carnet)
      for (const nota of notas) {
        promedio += parseFloat(nota.nota / notas.length)
      }
      if(promedio >= 61) ganaron++
      else perdieron++
    }
  } catch (error) {
    console.error('Error al ejecutar la consulta: ' + error);
  }

  return {
    "ganaron": ganaron,
    "perdieron": perdieron
  }

}

const getPromedio = async(all_users, sem_prom) => {
  let alumnos_promedio = []
  let nombres = []
  let valor_promedio = []
  try {
    for (const usuario of all_users) {
      let promedio = 0;
      const semestre = sem_prom; // Reemplaza con el semestre deseado
      const carnet = usuario.carnet; // Supongamos que el carnet del usuario está almacenado en cada objeto de usuario
      // // Realiza la consulta para obtener las notas del usuario en el curso y semestre especificados
      const data_alumnos = await getSpecificSemestre(semestre, carnet)
      for (const nota of data_alumnos) {
        promedio += parseFloat(nota.nota / data_alumnos.length)
      }
      if (data_alumnos.length > 0) {
        alumnos_promedio.push({
          "alumno": data_alumnos[0].nombre_alumno,
          "promedio": parseFloat(promedio.toFixed(2))
        })
      }
    }
    // Ordenar el arreglo por el campo "promedio" de mayor a menor
    alumnos_promedio.sort((a, b) => b.promedio - a.promedio);
    
    // Limitar el arreglo a solo tres elementos
    const primerosTres = alumnos_promedio.slice(0, 3);
    alumnos_promedio = primerosTres
    
    alumnos_promedio.forEach(item => {
      nombres.push(item.alumno);
      valor_promedio.push(item.promedio);
    });
  } catch (error) {
    console.error('Error al ejecutar la consulta: ' + error);
  }

  return {
    "mejor_promedio": {
      "labels": nombres,
      "valores": valor_promedio
    },
  }

}

const getCantidadAlumnos = async(sem_alum, all_courses) => {
  let cursos_cantidad = []
  let nombre_curso = []
  let cantidad_alumnos = []
  try {
    for (const curso of all_courses) {
      // // Realiza la consulta para obtener las notas del usuario en el curso y semestre especificados
      const data_cursos = await getAlumnosSpecificSemestre(sem_alum, curso.curso_nombre)
      cursos_cantidad.push({
        "curso": curso.curso_nombre,
        "cantidad": data_cursos.length
      })
      }
    // Ordenar el arreglo por el campo "promedio" de mayor a menor
    cursos_cantidad.sort((a, b) => b.cantidad - a.cantidad);
    
    // // Limitar el arreglo a solo tres elementos
    const primerosTres = cursos_cantidad.slice(0, 3);
    cursos_cantidad = primerosTres
    
    cursos_cantidad.forEach(item => {
      nombre_curso.push(item.curso);
      cantidad_alumnos.push(item.cantidad);
    });
  } catch (error) {
    console.error('Error al ejecutar la consulta: ' + error);
  }

  return {
    "mayor_alumnos": {
      "labels": nombre_curso,
      "valores": cantidad_alumnos
    },
  }

}

const getDataTable = () => {
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
          results,
        });
      }
    });
  });
}

const getDataMysql = async(curso_apr, sem_apr, sem_prom, sem_alum) => {
  const all_users = await getAllUsers()
  const all_courses = await getAllCourses()
  const primer_grafica = await getAprobacion(all_users, curso_apr, sem_apr)
  const segunda_grafica = await getPromedio(all_users, sem_apr)
  const tercer_grafica = await getCantidadAlumnos(sem_apr, all_courses)

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
          segunda_grafica,
          tercer_grafica,
          results,
        });
      }
    });
  });
};

const getDataFirstChar = async(curso_apr, sem_apr) => {
  const all_users = await getAllUsers()
  const primer_grafica = await getAprobacion(all_users, curso_apr, sem_apr)
  return new Promise((resolve, reject) => {
      resolve({
        primer_grafica,
      });
    })
};

const getDataSecondChar = async(sem_apr) => {
  const all_users = await getAllUsers()
  const segunda_grafica = await getPromedio(all_users, sem_apr)
  return new Promise((resolve, reject) => {
      resolve({
        segunda_grafica,
      });
    })
};

const getDataThirdChar = async(sem_apr) => {
  const all_courses = await getAllCourses()
  const tercer_grafica = await getCantidadAlumnos(sem_apr, all_courses)
  return new Promise((resolve, reject) => {
      resolve({
        tercer_grafica,
      });
    })
};

  export { getDataMysql, getDataFirstChar, getDataSecondChar, getDataThirdChar, getDataTable };