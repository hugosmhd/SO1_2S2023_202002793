from flask import Flask, jsonify, request, make_response
from flask_cors import CORS
import redis
import pymysql
from os import getenv
import json

app = Flask(__name__)
CORS(app)

r = redis.StrictRedis(host=getenv("DB_HOST_REDIS"), port=6379, db=0)

def obtener_conexion():
    return pymysql.connect(host=getenv("DB_HOST"),
                            user=getenv("DB_USER"),
                            password=getenv("DB_PASSWORD"),
                            database=getenv("DB_DATABASE"))

def insert_mysql(request):
    curso_nombre = request.json['curso']
    carnet = request.json['carnet']
    nombre = request.json['nombre']
    nota = request.json['nota']
    semestre = request.json['semestre']
    year = request.json['year']

    conexion = obtener_conexion()
    curso_id = None
    try:
        with conexion.cursor() as cursor:
            cursor.execute("SELECT curso_nombre FROM Cursos WHERE curso_nombre = %s", (curso_nombre,))
        curso_id = cursor.fetchone()
    except pymysql.MySQLError as error:
        print("Error de MySQL:", error)
        pass

    if curso_id is None:
        try:
            with conexion.cursor() as cursor:
                cursor.execute("INSERT INTO Cursos (curso_nombre) VALUES (%s)",
                            (curso_nombre))
            conexion.commit()
        except pymysql.MySQLError as error:
            print("Error INSERT Cursos")
            if f"Duplicate entry '{curso_nombre}' for key 'Cursos.PRIMARY'" in str(error):
                print(f"Error de MySQL: {error}")
                pass

    alumno_carnet = None
    try:
        with conexion.cursor() as cursor:
            cursor.execute(
                "SELECT carnet FROM Alumnos WHERE carnet = %s", (carnet,))
        alumno_carnet = cursor.fetchone()
    except pymysql.MySQLError as error:
        print("Error de MySQL:", error)
        pass

    if alumno_carnet is None:
        try:
            with conexion.cursor() as cursor:
                cursor.execute("INSERT INTO Alumnos (carnet, nombre) VALUES (%s, %s)",
                            (carnet, nombre))
            conexion.commit()
        except pymysql.MySQLError as error:
            print("Error INSERT Alumnos")
            if f"Duplicate entry '{carnet}' for key 'Alumnos.PRIMARY'" in str(error):
                print(f"Error de MySQL: {error}")
                pass

    with conexion.cursor() as cursor:
        cursor.execute("INSERT INTO Notas (alumno_carnet, curso_nombre, nota, semestre, year) VALUES (%s, %s, %s, %s, %s)",
                       (carnet, curso_nombre, nota, semestre, year))
    conexion.commit()
    conexion.close()

def insert_redis(request):
    # 1. Agregar el carnet del estudiante al conjunto correspondiente.
# Utiliza la combinación de curso y semestre como clave del conjunto.
    curso = request.json["curso"]
    semestre = request.json["semestre"]
    carnet = request.json["carnet"]

    # Verifica si la clave del contador ya existe en Redis
    if not r.exists("TOTAL"):
        # Si la clave no existe, inicializa el contador en 1
        r.set("TOTAL", 1)
    else:
        # Si la clave ya existe, aumenta el contador en 1
        r.incr("TOTAL")

    # Agregar el carnet al conjunto del curso y semestre específicos.
    r.sadd(f"{curso}:{semestre}:carnets", carnet)

    # 2. Agregar la información completa del estudiante a la lista correspondiente.
    # Utiliza la combinación de curso y semestre como clave de la lista.
    estudiante_json = json.dumps(request.json)

    # Agregar la información del estudiante a la lista del curso y semestre específicos.
    r.lpush(f"{curso}:{semestre}:estudiantes", estudiante_json)

    # 3. Para contar la cantidad de alumnos en un curso y semestre específicos, puedes usar el comando scard (cardinalidad del conjunto).
    cantidad_alumnos = r.scard(f"{curso}:{semestre}:carnets")
    return jsonify({"mensaje": f"Contador para {curso} - {semestre}: {cantidad_alumnos}"})
# 4. Para obtener la lista de estudiantes en un curso y semestre específicos, puedes usar el comando lrange.
    # curso = request.json['curso']
    # semestre = request.json['semestre']
    # clave_contador = f"{curso}:{semestre}"

    # # Verifica si la clave del contador ya existe en Redis
    # if not r.exists(clave_contador):
    #     # Si la clave no existe, inicializa el contador en 1
    #     r.set(clave_contador, 1)
    # else:
    #     # Si la clave ya existe, aumenta el contador en 1
    #     r.incr(clave_contador)

    # contador_actual = r.get(clave_contador)
    # return jsonify({"mensaje": f"Contador para {curso} - {semestre}: {contador_actual.decode('utf-8')}"})

@app.route('/', methods=['GET'])
def get_init():
    response = make_response('hello, world python!', 200)
    return response

@app.route('/insert/', methods=['POST'])
def add_data():
    insert_mysql(request)
    data = insert_redis(request)
    return data, 200
    # return "Data received", 200

@app.route('/reporte', methods=['GET'])
def generar_reporte():
    # ESTO ES PARA OBTENER TODOS LOS REGISTROS
    # todas_las_claves = r.keys('*')

    # # Inicializa la suma de contadores en 0
    # suma_contadores = 0

    # # Itera a través de todas las claves y suma los valores
    # for clave in todas_las_claves:
    #     valor = r.get(clave)
    #     suma_contadores += int(valor.decode('utf-8'))

    # return jsonify({"suma_contadores": suma_contadores})

    # ESTO ES PARA LO DE UN SEMESTRE EN ESPECIFICO
    # Semestre que deseas consultar
    semestre_objetivo = request.args.get('semestre')

    # Obtén todas las claves en Redis
    todas_las_claves = r.keys('*')

    # Filtra y obtén los contadores del semestre objetivo
    contadores_semestre = {}

    for clave in todas_las_claves:
        clave_str = clave.decode('utf-8')  # Convierte la clave a una cadena
        curso, semestre = clave_str.split(":")

        if semestre == semestre_objetivo:
            valor = r.get(clave_str)
            contadores_semestre[curso] = int(valor.decode('utf-8'))

    return jsonify(contadores_semestre)

if __name__ == '__main__':
    print(getenv("DB_HOST"))
    print(getenv("DB_USER"))
    print(getenv("DB_PASSWORD"))
    print(getenv("DB_DATABASE"))
    print(getenv("DB_HOST_REDIS"))
    app.run(host='0.0.0.0',debug=True,port=3000)