import { get, client } from "../db/redis.db.js";
import { promisify } from "util";
const keysAsync = promisify(client.keys).bind(client);
const scardAsync = promisify(client.scard).bind(client);

const getDataRedis = async (semestre) => {
    let sumaTotalAlumnos = 0;
    
    let labels = []
    let valores = []
    
    const pattern = `*:${semestre}:carnets`;

    const sumaContadores = await client.get("TOTAL");

    try {
        const keys = await keysAsync(pattern);

        for (const key of keys) {
            const cantidadAlumnos = await scardAsync(key);
            const [curso, semestre] = key.split(':');
            console.log(`Cantidad de alumnos en ${curso} - ${semestre}: ${cantidadAlumnos}`);
            labels.push(curso)
            valores.push(cantidadAlumnos)
            sumaTotalAlumnos += cantidadAlumnos
        }
    } catch (error) {
        console.error('Error al obtener las claves o la cantidad de alumnos:', error);
    }

    return { suma_contadores: sumaContadores, total_alumnos: sumaTotalAlumnos, labels, valores };
};

  export { getDataRedis };