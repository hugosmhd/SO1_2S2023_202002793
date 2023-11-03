
# Universidad de San Carlos USAC

# Lab. Sistemas Operativos 1 Proyecto 1

### Hugo Sebastian Martínez Hernández - 202002793

# Manual Usuario

## Introducción
El objetivo de este proyecto es evaluar y mejorar el rendimiento de un sistema de ingreso de notas en línea mediante pruebas de carga y rendimiento utilizando Locust, Kubernetes y servicios en la nube como Cloud SQL y Cloud run. El sistema permite a los profesores o administradores académicos ingresar y gestionar las calificaciones de los estudiantes de manera eficiente. Ademas se implemento una aplicación web donde se muestra las estadísticas y reportes de los estudiantes. En la presente guiá se brindara información de como podemos hacer buen uso de esta aplicación.

## Objetivos
El objetivo tanto de este reporte como de la aplicación se muestran a continuación:

- **Para quien use la aplicación:** que puedan administrar de forma eficiente las notas de los estudiantes, y puedan visualizar en forma de reportes y gráficos todas los notas e información de utilidad
- **Para quien lea el manual:** que pueda tener una idea clara de como poder ejecutar el proyecto y como poder utilizar la aplicación.
- **Para los estudiantes que realizan la proyecto:** poner en practica todo lo aprendido en laboratorio y en la clase magistral para poder desarrollar el proyecto.

## Modo de ingreso de notas
El ingreso de notas se hace desde una aplicación que se llama locust. Es muy fácil de correr y se tratara de explicar de una manera que sea fácil de entender y ejecutar.

1. Como primer punto tenemos que tener instalado todo lo necesario para poder correr nuestro programa, se brindaran algunos comandos, que se pueden ejecutar desde la terminal de una computadora con sistema operativo Ubuntu.

Comandos para la actualización del sistema:
```bash
sudo apt update
sudo apt upgrade
```
Instalar Python, Pip y locust con el siguiente comando:
```bash
sudo apt install python3
sudo apt install python3-pip
pip install locust
```
Verificar que todo se haya instalado correctamente viendo las versiones de cada paquete con los siguientes comandos:

```bash
python3 --version # Version de python
locust --version # Version de locust
```
Debe de aparecer la versión de cada paquete, algo parecido como se ve en la siguiente imagen:
![Versiones de los paquetes instalados](https://media.discordapp.net/attachments/764502305009303622/1169748065025015859/imagen.png?ex=655687c7&is=654412c7&hm=a818d1bcf2481fc1158cd83c4205f9f1509f0bb983daf08a767eca2eca43797c&=)
## Correr locust.

Una vez instalado todo los paquetes anteriores debemos de estar dentro de nuestra carpeta del Proyecto2 y dirigirnos a la carpeta locust. Se debe abrir una terminal en esa dirección de la carpeta y ejecutar el siguiente comando:
```bash
locust -f traffic.py
```
En esa misma carpeta se encuentra la entrada de las notas, que es un archivo JSON con el nombre entrada.json, con todas las notas a ingresar en el sistema. Este archivo no se deberá de cambiar de ubicación ni de nombre.

![Archivo de entrada](https://media.discordapp.net/attachments/764502305009303622/1169751320429858846/imagen.png?ex=65568acf&is=654415cf&hm=0f56ecbdcff09e39c82bad014ba88e06e92d3eb2ba6af9b394937dd7b83fd122&=&width=326&height=426)

Una vez ejecutando el comando de locust se podrá enviar toda esa información hacia el servidor de la siguiente manera. Cuando se corre el comando se desplegara en la terminal algo parecido a la siguiente imagen:
![Servidor de Locust corriendo](https://media.discordapp.net/attachments/764502305009303622/1169752129171370067/imagen.png?ex=65568b90&is=65441690&hm=dd486d58969169a594e98238bcd21079533ec1715ee0d84031a50ce35f499d39&=&width=972&height=80)
Tendremos que dirigirnos al navegador web y escribir la siguiente dirección, que brinda locust:
```
http://0.0.0.0:8089/
```

Al entrar a la dirección anterior nos desplegara una pagina como se vera a continuación:

![Pagina principal locust](https://media.discordapp.net/attachments/764502305009303622/1169783595636895804/imagen.png?ex=6556a8de&is=654433de&hm=cf22adf592b2e0851893a70ec836b0f9cd8975f24e275494cae579e2062d144d&=&width=742&height=426)
En esta sección debemos configurar la cantidad de usuarios y la aparición de usuarios por segundo, esto queda a discreción del usuario. En el host se deberá de colocar lo siguiente:
```bash
http://so1p2.34.171.85.31.nip.io/insert
```
La configuración se vera como lo siguiente:
![Configuracion Locust](https://media.discordapp.net/attachments/764502305009303622/1169784181732151427/imagen.png?ex=6556a96a&is=6544346a&hm=6206588c9326e8db0590e7205fff0134f01ebdafd1734f3e54483a906148d004&=&width=742&height=426)
Una vez configurado con todos los parámetros la pagina procedemos a presionar el botón ***Start swarming*** y esto empezara a enviar toda la información que tenemos en nuestro archivo de configuración inicial mencionado anteriormente.

### Aplicación Web

Para acceder a la aplicación web se tiene que ingresar en la siguiente dirección desde cualquier navegador:
```
https://frontend-so1p2-obxpso6mea-uc.a.run.app/tiempo-real
```
La aplicación web cuenta con dos apartados que son, Tiempo Real y Reportes estáticos.
Tiempo Real: en esta sección el usuario podrá ver la cantidad de datos que pasan por la aplicación en tiempo real y podrá observar una grafica de  barras la cual muestra el curso vs la cantidad de alumnos. El usuario ademas tendrá la oportunidad de escoger el semestre especifico del cual desea visualizar la informacion.
![Tiempo Real](https://media.discordapp.net/attachments/764502305009303622/1169785334582755388/imagen.png?ex=6556aa7d&is=6544357d&hm=7dd19e4b469dbabc773b078bc7ed5e33416b0181cccee37918036553a990a3c3&=&width=742&height=426)
**Reportes estáticos:** en esta sección el usuario podrá visualizar en una tabla todas las notas que se ingresaron al sistema. La tabla cuenta con una paginación de 10 estudiantes, es decir solo se podrán ver 10 estudiantes por pagina y se podrá navegar por toda la tabla para ver todos los registros. 

![Reportes estaticos](https://media.discordapp.net/attachments/764502305009303622/1169788044199596142/imagen.png?ex=6556ad03&is=65443803&hm=5a486a2592aa9160bffa991054c6394f03fc978da72d87ba6bef422c29b8a766&=&width=742&height=426)
En la parte inferior a la tabla se visualizaran tres gráficos que son los siguientes:
- **Porcentaje de aprobación:** esta es una grafica  de pastel, esta indica la cantidad de estudiantes que aprobaron cierto curso en un semestre especifico. Tanto el curso como el semestre se podrán elegir por medio de un select y cuando quieran realizar la consulta se deberá presionar el botón consultar.
- **Alumnos con mejor promedio:** esta es una grafica de barras la cual muestra el top 3 de alumnos con mejor promedio en un semestre en especifico. El semestre se podrá elegir por medio de un select.
- **Curso con mayor numero de alumnos:** esta es una grafica de barras la cual muestra el top 3 de cursos con mayor numero de estudiantes en un semestre. El semestre se podrá escoger por medio de un select.

![Reportes estaticos](https://media.discordapp.net/attachments/764502305009303622/1169788257928753234/imagen.png?ex=6556ad36&is=65443836&hm=6028a619840486316a2063c5b570078acac49be7fd93f63377160c671592b113&=&width=954&height=425)

**Botón Recargar:** este botón refrescara toda la pagina de reportes para visualizar datos nuevos que se hayan ingresado al sistema. Este botón se encuentra en la parte superior de esta sección de reportes.
