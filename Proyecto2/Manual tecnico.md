
# Universidad de San Carlos USAC

# Lab. Sistemas Operativos 1 Proyecto 1

### Hugo Sebastian Martínez Hernández - 202002793

# Manual Técnico

## Introducción
El objetivo de este proyecto es evaluar y mejorar el rendimiento de un sistema de ingreso de notas en línea mediante pruebas de carga y rendimiento utilizando Locust, Kubernetes y servicios en la nube como Cloud SQL y Cloud run. El sistema permite a los profesores o administradores académicos ingresar y gestionar las calificaciones de los estudiantes de manera eficiente. Ademas se implemento una aplicación web donde se muestra las estadísticas y reportes de los estudiantes. En la presente guiá se brindara información de como podemos hacer buen uso de esta aplicación.

## Objetivos
El objetivo tanto de este reporte como de la aplicación se muestran a continuación:

- **Para quien use la aplicación:** que puedan administrar de forma eficiente las notas de los estudiantes, y puedan visualizar en forma de reportes y gráficos todas los notas e información de utilidad
- **Para quien lea el manual:** que pueda tener una idea clara de como poder ejecutar el proyecto y como poder utilizar la aplicación.
- **Para los estudiantes que realizan la proyecto:** poner en practica todo lo aprendido en laboratorio y en la clase magistral para poder desarrollar el proyecto.
- Desplegar un clúster de Kubernetes y sus servicios.
- Conocer ServerLess por medio de Cloud Run.
- Utilizar bases de datos en la nube con Cloud SQL y Redis.
- Controlar el tráfico de datos por medio de balanceadores de carga.

## Arquitectura del proyecto

![Arquitectura del proyecto](https://media.discordapp.net/attachments/764502305009303622/1169790045826334813/imagen.png?ex=6556aee0&is=654439e0&hm=be97df661d73ba37fad0077d310b98d412ab8564d3104cf84ae6d2faf3bf081a&=)
## Generador de Trafico

Se uso un generador de trafico con la ayuda de locust y python. Esta parte se encontrara en la carpeta llamada locust. Tendra 2 archivos uno es el de python y otro es un archivo llamado entrada.json, este ultimo archivo servira como datos para enviar hacia un ingress que se hablara mas adelante. Para correr la aplicacion o el generador de trafico hay que abrir una terminal en la carpeta de locust y correr le siguiente comando:
```bash
locust -f traffic.py
```

El archivo de entrada debe lucir como la siguiente imagen:
![Archivo entrada locust](https://media.discordapp.net/attachments/764502305009303622/1169751320429858846/imagen.png?ex=65568acf&is=654415cf&hm=0f56ecbdcff09e39c82bad014ba88e06e92d3eb2ba6af9b394937dd7b83fd122&=&width=326&height=426)
Los Cursos a Monitorear pueden ser:

- **SO1** - Sistemas Operativos 1
- **BD1** - Sistemas de Bases de Datos 1
- **LFP** - Lenguajes Formales y de Programación
- **SA** - Software Avanzado
- **AYD1** - Análisis y Diseño 1

La descripción para semestre puede ser:

- **1S:** Primer semestre
- **2S:** Segundo semestre

**Nota:** 50, 60, 70, 80, 90, 100.
**Año:** 2023

## Kubernetes

La idea principal de este proyecto es poder desplegarlo en Kubernetes que se encargará de la orquestación de los contenedores de las diferentes partes de la aplicación. De aqui en adelante se trabajara con Kubernetes de que brinda Google que es GKE. Para ellos es importante tener instalado **kubectl, gcloud** y todo lo necesario para trabajar.

Una pequeña guia para instalarlos desde Ubuntu:
Descarga el paquete del GCloud SDK
```
curl -O https://dl.google.com/dl/cloudsdk/channels/rapid/downloads/google-cloud-sdk-367.0.0-linux-x86_64.tar.gz
```

Desempaquetar 
```
tar zxvf google-cloud-sdk-367.0.0-linux-x86_64.tar.gz
```
Iniciar la Instalacion
```
./google-cloud-sdk/install.sh
```
## Configurar gcloud sdk
```
gcloud init
```
Configurar el proyecto y la región por defecto. Utilizar el id de su proyecto.

```
gcloud config set project <ingresar-nombre-proyecto>
```
Configurar la Zona horaria
```
gcloud config set compute/zone <ingresar-zona-horaria>
```
## Instalar Kubectl
```
gcloud components install kubectl
```
## Creacion del cluster

Esta creacion se hizo desde la interfaz que provee Google y se creo un cluster con 3 nodos.



## Ingress

El Ingress se encargará de gestionar el acceso externo a los servicios dentro del clúster. Actúa como una puerta de  entrada que posibilita la exposición de servicios HTTP y HTTPS fuera del clúster. Por otro lado, el Traffic Split se encargará de distribuir de manera equitativa el tráfico de datos. En otras palabras, la configuración del tráfico será del 50% para la ruta 1 y del 50% para la ruta 2.

## Configurar Ingress Controller NGINX

Para poder crear el ingress se ejecutaron los siguientes comandos:
- Se crea un namespace unicamente para nginx y debe ser ese nombre: `kubectl create ns nginx-ingress`
-Se agrega el repositorio ingress-nginx: `helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx`
- `helm repo update`
- Se hacen las intalaciones pertinentes:`helm install nginx-ingress ingress-nginx/ingress-nginx -n nginx-ingress`
- Para obtener el ingress que se creo: `kubectl get services -n nginx-ingress`


## Rutas

Como se vio en la arquitectura se cuentan con 2 rutas. El propósito es evaluar y contrastar el rendimiento con respecto a otro enfoque existente.

 1. Ruta 1: Cuenta con un: grpc-client que recibe la información y la envía al grcp-server. El grcp-server escribe en la base de datos de MYSQL
 2. Ruta 2: se desarrollo en python, con la siguiente estructura: escribir en la base de datos de Redis y escribir en la base de datos de MySQL.


## Rutas

El HPA ajusta automáticamente la cantidad de PODS en ejecución en un despliegue o conjunto de réplicas según la utilización de la CPU u otras métricas. Para este proyecto se configura que cada Pod debe tener un minimo de 1 replica y un maximo de 3 y se configuro que el uso de la CPU no exceda el 50%.

## SOCKET IO

Se implemento un canal websocket para la conexion en tiempo real entre el frontend y el backend que estara haciendo consultas a la base de Redis.

## CLOUD SQL

Este es un servicio de GCP para manejar bases de datos, para este proyecto se uso una base de datos en MYSQL y ademas se le configuro una IP privada para hacer la conexion hacia la base de datos. Se crearon 3 tablas que almacenaran la informacion.
```SQL
CREATE database  so1_base2;
use so1_base2;

CREATE TABLE Alumnos (
    carnet INT PRIMARY KEY,
    nombre VARCHAR(255)
);

CREATE TABLE Cursos (
    curso_nombre VARCHAR(255) PRIMARY KEY
);

CREATE TABLE Notas (
    nota_id INT AUTO_INCREMENT PRIMARY KEY,
    alumno_carnet INT,
    curso_nombre VARCHAR(255),
    nota DECIMAL(5, 2),
    semestre VARCHAR(5),
    year INT,
    FOREIGN KEY (alumno_carnet) REFERENCES Alumnos (carnet),
    FOREIGN KEY (curso_nombre) REFERENCES Cursos (curso_nombre)
);
```
## CLOUD RUN

Se hizo uso de este servicio que provee GCP para desplegar y virtualizar nuestra aplicacion de frontend que fue desarrollada en React + vite.

## Namespace, ingress, Pod de Redis y secret

Para la creacion de todos estos recursos se aplica el siguiente comando:
***Nota:*** Es importante primero ejecutar el archivo del namespace.
```
kubectl apply -f <ruta_archivo> -n <nombre_namespace>`
```

## Creacion de Deployments, Services y el HPA

Para crear estos 3 recursos, unicamente se creo un archivo que contiene los 3 recursos. Los archivos que se deberan de ejecutar son los siguientes:

 1. api-node.yaml
 2. api-python.yaml
 3. grcp.yaml

El comando que se debe de ejecutar es el siguiente:
```
kubectl apply -f <ruta_archivo> -n <nombre_namespace>`
```
## Otros comandos de utilidad

Obtener namespace
- `kubectl get ns`

Crear namespace de forma imperativa
- `kubectl create ns <nombre_namespace>`

Crear cualquier objeto de k8s
- `kubectl apply -f <ruta_archivo> -n <nombre_namespace>`

Eliminar cualquier objeto de k8s
- `kubectl delete -f <ruta_archivo> -n <nombre_namespace>`

Editar cualquier objeto de k8s
- `kubectl edit <tipo_objeto> <nombre_objeto> -n <nombre_namespace>`

Obtener cualquier objeto de k8s
- `kubectl get <tipo_objeto> -n <nombre_namespace>`

Obtener todos los objeto de k8s (Exceptuando Ingress)
- `kubectl get all -n <nombre_namespace>`

Nodeport
- `kubectl port-forward service/<service-name> <local-port>:<service-port> -n <nombre_namespace>`
