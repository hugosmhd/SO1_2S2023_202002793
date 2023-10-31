import { get, client } from "../db/redis.db.js";

const getDataRedis = async (semestre) => {
    let sumaContadores = 0;
    
    let labels = []
    let valores = []
    try {
    // Obtén todas las claves en Redis
    const todasLasClaves = await client.keys('*');

    // Inicializa la suma de contadores en 0

    // Itera a través de todas las claves y suma los valores
    for (const clave of todasLasClaves) {
        const valor = await client.get(clave);
        sumaContadores += parseInt(valor, 10);
    }

    // return { suma_contadores: sumaContadores };
    } catch (error) {
        console.log(error);
        // return { suma_contadores: 0 };
    }
    try {
        // const contadoresSemestre = {};
        // Obtén el semestre objetivo de la consulta
    const semestreObjetivo = semestre;
    // Obtén todas las claves en Redis
    const todasLasClaves = await client.keys('*');
    // Filtra y obtén los contadores del semestre objetivo
    
    for (const clave of todasLasClaves) {
        const claveStr = clave;
        const [curso, semestre] = claveStr.split(":");

        if (semestre === semestreObjetivo) {
        const valor = await client.get(claveStr);
        // contadoresSemestre[curso] = parseInt(valor, 10);
        labels.push(curso)
        valores.push(valor)
        }
    }
    } catch (error) {
        console.log(error);
    }

    return { suma_contadores: sumaContadores, labels, valores };
};

  export { getDataRedis };