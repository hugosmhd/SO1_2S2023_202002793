const { google } = require('googleapis');
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const pool = require('./db');
const app = express();

app.use(cors());

const port = 3000;
app.use(express.json());

app.use(express.json()); // Para parsear JSON en las solicitudes

// Crea un cliente de autenticación
const auth = new google.auth.GoogleAuth({
  keyFilename: 'auth_gcp/clave_de_servicio.json', // Reemplaza con la ruta de tu clave de servicio JSON
  scopes: ['https://www.googleapis.com/auth/cloud-platform'],
});

// Crea un cliente de Compute Engine
const computeEngine = google.compute({
  version: 'v1',
  auth,
});

// Define el nombre de tu grupo de instancias
const instanceGroupName = 'instance-group-1';
// const projectId = 'empyrean-box-397402'; // Reemplaza con el ID de tu proyecto GCP

cont = 1
numero_vm_actual = 0
maquinas_actuales = []
maquinas_historial = []
// apiUrlGo = "http://localhost:8000/data-kernel"
// apiUrlGo = "http://34.173.224.252:8000/"

async function insertarDatos(ram_uso, cpu_uso, index) {
  try {
    const connection = await pool.getConnection(); // Obtén una conexión del pool
    const name = maquinas_actuales[index].nombre
    const sql = 'INSERT INTO uso_cpu_ram (nombre_vm, porcentaje_ram, porcentaje_cpu) VALUES (?, ?, ?)'; // Define tu consulta SQL
    const values = [name, ram_uso, cpu_uso]; // Especifica los valores a insertar
    
    const [result] = await connection.execute(sql, values); // Ejecuta la consulta
    
    connection.release(); // Libera la conexión
  } catch (error) {
    console.error('Error al insertar datos:', error);
  }
}

async function obtenerDatos(nombre_vm, limite) {
  try {
    const connection = await pool.getConnection(); // Obtén una conexión del pool
    const [rows] = await connection.execute(
      `SELECT * FROM uso_cpu_ram WHERE nombre_vm = ? ORDER BY fecha DESC LIMIT ${limite}`,
      [nombre_vm]
    );

    connection.release();
    return rows
  } catch (error) {
    console.error('Error al ejecutar la consulta:', error);
  }
}

async function getIPsInGroup() {
  try {
    const projectId = 'empyrean-box-397402'; // Reemplaza con el ID de tu proyecto GCP
    const zone = 'us-central1-c'; // Reemplaza con la zona de tus instancias
    
    const res = await computeEngine.instanceGroups.listInstances({
      project: projectId,
      zone: zone,
      instanceGroup: instanceGroupName,
    });
    
    // console.log('Direcciones IP externas de las instancias en el grupo:');
    // console.log(res.data.items.length);

    if(res.data.items.length != 0 && res.data.items.length > numero_vm_actual) {
      numero_vm_actual = res.data.items.length;
      for (const instanceInfo of res.data.items) {
        const instanceUrl = instanceInfo.instance;
        const instanceName = instanceUrl.split('/').pop();
        const ultimosCuatro = instanceName.slice(-4);

        const instanceDetails = await computeEngine.instances.get({
          project: projectId,
          zone: zone,
          instance: instanceName,
        });
  
        const networkInterfaces = instanceDetails.data.networkInterfaces;
  
        networkInterfaces.forEach((networkInterface) => {
          const accessConfigs = networkInterface.accessConfigs;
          accessConfigs.forEach((accessConfig) => {
            
            if (accessConfig.natIP) {
              const maquina = {
                "nombre": ultimosCuatro,
                "ip": accessConfig.natIP
              }
              const existeMaquina = maquinas_actuales.some((item) => item.nombre === maquina.nombre);
              if (!existeMaquina) {
                maquinas_actuales.push(maquina);
                maquinas_historial.push(maquina)
                // console.log(`Dirección IP externa de ${instanceName}: ${accessConfig.natIP}`);
              }
            }
          });
        });
      }

    } else if(res.data.items.length != 0 && res.data.items.length < numero_vm_actual) {
      numero_vm_actual = res.data.items.length;
      for (const instanceInfo of res.data.items) {
        const instanceUrl = instanceInfo.instance;
        const instanceName = instanceUrl.split('/').pop();
        const ultimosCuatro = instanceName.slice(-4);
  
        const instanceDetails = await computeEngine.instances.get({
          project: projectId,
          zone: zone,
          instance: instanceName,
        });
  
        const networkInterfaces = instanceDetails.data.networkInterfaces;
        new_arreglo = []
        networkInterfaces.forEach((networkInterface) => {
          const accessConfigs = networkInterface.accessConfigs;
          accessConfigs.forEach((accessConfig) => {
            if (accessConfig.natIP) {
              const maquina = {
                "nombre": ultimosCuatro,
                "ip": accessConfig.natIP
              }
              new_arreglo.push(maquina);
              // console.log(`Dirección IP externa de ${instanceName}: ${accessConfig.natIP}`);
            }
          });
        });
        maquinas_actuales = new_arreglo
      }

    }

  } catch (err) {
    console.error('Error al obtener las instancias en el grupo:', err);
  }
}

app.get('/history/:index', async (req, res) => {
  await getIPsInGroup();
  const index = req.params.index;
  if (maquinas_historial.length === 0) {
    res.json({
      data_ram: [],
      data_cpu: [],
      label: [],
      maquinas: [],
    });
  } else {
    const name = maquinas_historial[index].nombre;
    const limit = 20;
    const rows = await obtenerDatos(name, limit);
    label = []
    data_ram = []
    data_cpu = []
    
    if(rows != undefined) {
      rows.forEach((row) => {
        const porcentaje_ram = row.porcentaje_ram; // Accede a la columna 'porcentaje_ram'
        const porcentaje_cpu = row.porcentaje_cpu / 1000000; // Accede a la columna 'porcentaje_cpu'
        const fecha = row.fecha; // Accede a la columna 'fecha'
        let periodo = '';
        if (fecha.getHours() >= 12) {
          periodo = 'PM';
        } else {
          periodo = 'AM';
        }
        const new_label = fecha.getHours()+":"+fecha.getMinutes()+":"+fecha.getSeconds()+periodo; // Obtiene la hora (0-23)
        label.unshift(new_label)
        data_ram.unshift(porcentaje_ram)
        data_cpu.unshift(porcentaje_cpu)
        // Realiza las operaciones que necesites con cada fila de resultados
        // console.log(`ID: ${id}, RAM: ${porcentaje_ram}, CPU: ${porcentaje_cpu}, Fecha: ${new_label}`);
      });
    }
    res.json({
      data_ram: data_ram,
      data_cpu: data_cpu,
      label: label,
      maquinas: maquinas_historial,
    });

  }
});

app.get('/:index', async (req, res) => {
  await getIPsInGroup()
  const index = req.params.index;
  if (maquinas_actuales.length === 0) {
    const data_cpu = {
      procesos: []
    }
    res.json({
      data_ram: [],
      data_cpu: data_cpu,
      maquinas: [],
    });
  } else if(index <= (maquinas_actuales.length - 1)) {
    apiUrlGo = "http://"+maquinas_actuales[index].ip+":8000/"
      axios.get(apiUrlGo+"data-kernel")
      .then(response => {
        const ram_uso = response.data.data_ram.Porcentaje_en_uso
        const cpu_uso = response.data.data_cpu.porcentaje_cpu
        insertarDatos(ram_uso, cpu_uso, index);
        res.json({
          data_ram: response.data.data_ram,
          data_cpu: response.data.data_cpu,
          maquinas: maquinas_actuales,
        });
      })
      .catch(error => {
        console.error('Error al obtener datos desde la API en Go:', error.message);
        res.status(500).json({ error: 'Error al obtener datos desde la API en Go' });
      });
  } else {
    const data_cpu = {
      procesos: []
    }
    res.json({
      data_ram: [],
      data_cpu: data_cpu,
      maquinas: maquinas_actuales,
    });
  }
});

app.get('/fill/vm', async (req, res) => {
  await getIPsInGroup()
  res.json({
    maquinas: maquinas_actuales,
  });
});

app.get('/kill/:id', (req, res) => {
  const id = req.params.id;
  axios.delete(apiUrlGo+'kill-proc/'+id)
    .then(response => {
      // console.log("Se hizo kill a el PID: " + id);
      res.json({
        data_ram: response.data.data_ram,
        data_cpu: response.data.data_cpu,
      });
    })
    .catch(error => {
      console.error('Error al obtener datos desde la API en Go:', error.message);
      res.status(500).json({ error: 'Error al obtener datos desde la API en Go' });
    });
});

app.post('/', (req, res) => {
  const ipAddress = req.header('x-forwarded-for')  ||
  req.socket.remoteAddress;
  res.send(ipAddress);
  console.log(ipAddress);
});

app.listen(port, () => {
  console.log(`Servidor Node.js escuchando en el puerto ${port}`);
});