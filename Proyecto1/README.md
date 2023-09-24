
# Universidad de San Carlos USAC

# Lab. Sistemas Operativos 1 Proyecto 1

## Hugo Sebastian Martínez Hernández - 202002793

## Introducción
En este proyecto, se tiene como objetivo principal implementar un sistema de monitoreo de recursos del
sistema y gestión de procesos, empleando varias tecnologías y lenguajes de programación. El sistema
resultante permitirá obtener información clave sobre el rendimiento del computador, procesos en ejecución
y su administración a través de una interfaz amigable. El para el despliegue del proyecto se utilizará GCP
Compute Engine y autoscaling para simular múltiples máquinas virtuales a monitorear.

## Módulo de RAM

Este módulo de Kernel se creó con la ayuda de  `C` , el cual se sobreescribio en el directorio /proc. La finalidad de este módulo es obtener el uso de Memoria RAM de la computadora host.

Características:
- Se importo la librería < sys/sysinfo.h>, <linux/mm.h>
- La información que se mostrará en el módulo se obtuvo por medio de los structs de información del sistema operativo.
- El nombre del módulo será: **ram_202002793**

Para crear el modulo de Kernel se utilizó un archivo `Makefile`.

## Módulo de Kernel de CPU

Este módulo de Kernel se creó con la ayuda de  `C` , el cual se sobreescribio en el directorio /proc. La finalidad de este módulo es obtener información de los procesos y procesos hijos de la computadora host.

Características:
- Se importo la librería <linux/sched.h>, <linux/sched/signal.h>
- La información que se muestra en el módulo es obtenida por medio de los structs de información del sistema operativo.
- El nombre del módulo será: **cpu_202002793**
  
Para crear el modulo de Kernel se utilizó un archivo `Makefile`.

## Explicación de creación de módulos de Kernel

Se deberá de tener instalado GCC y Makefile para poder compilar los archivos de C.
### Instalación de GCC
```bash
sudo apt install build-essential
sudo apt-get install manpages-dev
```
### Instalación de Makefile
```bash
sudo apt install make
```
### Verificación de instalación de GCC y Makefile
```bash
gcc --version
make --version
```
## Compilación de los módulos

Debemos de abrir una terminal en la carpeta donde esta el archivo Makefile y seguidamente ejecutar el siguiente comando:
```bash
make all
```
El comando anterior genera los archivos necesarios para la ejecución del modulo de Kernel que podrá ser insertado en la carpeta **/proc**. Estos archivos también se puede eliminar ejecutando el siguiente comando:
```bash
make clean
```
Para poder insertar el módulo en la carpeta **/proc** se ejecuta el siguiente comando:
```bash
sudo insmod <nombre_modulo>.ko
```
Para nuestro caso, el módulo de RAM se llama **ram_202002793.ko** y el módulo del CPU se llama **cpu_202002793.ko**

## Frontend

La Web UI fue desarrollada con ayuda del framework de JavaScript **React**

El Frontend cuenta con lo siguiente:

### Monitoreo en Tiempo Real
Esta pantalla es un tipo dashboard el cual cuenta con:
- Un select, en el cual se podrá seleccionar la máquina a monitorear de la cual se visualizaran los datos.
- Grafica en Tiempo Real del porcentaje de utilización de la memoria RAM.
- Grafica en Tiempo Real del porcentaje de utilización del CPU.
- Cuenta con un campo de filtrado para poder buscar por PID o por el nombre del proceso.
- También se listara todos los procesos con sus respectivos procesos hijos. de los cuales podrá enviar una señal kill para terminar el proceso.
![Página Principal](https://media.discordapp.net/attachments/764502305009303622/1155526013485318215/imagen.png?width=801&height=426)
![Lista de procesos y procesos hijos](https://media.discordapp.net/attachments/764502305009303622/1155526758804766800/imagen.png?width=801&height=426)
### Historial
El historial tendrá un resumen del monitoreo que se ha hecho de las máquinas y esta página cuenta con lo siguiente:
- Un Select para elegir la máquina de la cual se visualizará la información.
- Una Grafica del Rendimiento a lo largo del tiempo de la RAM.
- Una Grafica de Rendimiento a lo largo del tiempo del CPU.
![Historial_CPU](https://media.discordapp.net/attachments/764502305009303622/1155528434831863920/imagen.png?width=801&height=426)
![Monitor_RAM](https://media.discordapp.net/attachments/764502305009303622/1155528625186164777/imagen.png?width=801&height=426)

El frontend fue contenerizado y la imagen se puede descargar usando el siguiente comando:
```bash
docker push hugoses202002793/frontend_proy1_so1 
```

## API en NodeJS
Este servicio expone diversas APIs que posibilitan la comunicación con la base de datos. Dichas APIs serán empleadas tanto para la lectura de información desde el Frontend como para la escritura de datos desde
los agentes instalados en las máquinas sujetas a monitoreo.

Esta API tendra los siguientes endpoints:

**/:index** : este endpoint es de tipo GET y obtendrá información de una máquina en específico y ademas guarda la información en la base de datos. Devuelve toda la información necesaria para poder mostrarla en el Frontend.

**/history/:index** : este endpoint es de tipo GET y obtendrá información la base de datos de una máquina en especifico. Devuelve la información necesaria para poder generar las graficas a lo largo del tiempo de dicha máquina.

**/kill/:id** : este endpoint es de tipo GET y ejecutara el kill del id que se le envie.

El backend fue contenerizado y la imagen se puede descargar usando el siguiente comando:
```bash
docker push hugoses202002793/backend_proy1_so1 
```

## Base de datos
Se implemento una base de datos MySQL por medio de un contenedor de Docker, esto para guardar los datos de memoria ram y cpu. La base de datos debe de tener persistencia por lo que implemento un Volumen de Docker para evitar que los datos se pierdan cada vez que
el contenedor se reinicia.

Se ejecuto un script inicial para poder crear la base de datos con las tablas iniciales y poder manejar la base de datos:
```sql
CREATE  DATABASE  IF  NOT  EXISTS proyecto1;
USE proyecto1; 

CREATE  TABLE  IF  NOT  EXISTS uso_cpu_ram (
id INT  PRIMARY KEY AUTO_INCREMENT,
nombre_vm VARCHAR(4),
porcentaje_ram INT,
porcentaje_cpu INT,
fecha DATETIME  DEFAULT CURRENT_TIMESTAMP
);
```

## Agente
El agente básicamente es una API en las máquinas que se va a monitorear y se encarga de hacer la lectura de los módulos de Kernel que fueron creados con anterioridad. Esta API expone los siguientes endpoints:

**/data-kernel** : este endpoint es de tipo GET y obtendrá la información de la máquina haciendo uso de los módulos de Kernel tanto del CPU como el de la RAM.

**/kill-proc/:id** : este endpoint es de tipo DELETE y ejecutara el kill del id que se le envié.

El backend fue contenerizado y la imagen se puede descargar usando el siguiente comando:
```bash
docker push hugoses202002793/agent_proy1_so1
```

## Configuración de GCP

Antes de configurar la plantilla para poder crear un grupo de instancias que iban a tener el Agente, que se iba a encargar de obtener la información de la máquina en cuestión, se genero una máquina virtual aislada donde se instalo Docker para poder ejecutar el contenedor del agente y ademas se configuraron algunos scripts que se ejecutarán al inicio para que se inserten los módulos de Kernel de forma automatica y que tambien se ejecutara el contender del Agente.

Primero se copiaron los módulos a otra carpeta del sistema con el siguiente comando, se tiene que copiar los 2 módulos que se usaran:

 ```bash
sudo cp <<nombre_modulo.ko>> /lib/modules/$(uname -r)/extra/
```
Se creo un script de inicio el siguiente comando:

```bash
sudo nano /usr/local/bin/load_module.sh
```
Y el script tendrá la siguiente información:
```bash
#!/bin/bash
sudo insmod /lib/modules/$(uname -r)/extra/cpu_202002793.ko
sudo insmod /lib/modules/$(uname -r)/extra/ram_202002793.ko
```

Hacemos que el script sea ejecutable con el siguiente comando:
```bash
sudo chmod +x /usr/local/bin/load_module.sh
```

Se crea un servicio systemd:
```bash
sudo nano /etc/systemd/system/load_module.service
```

El systemd tendra la siguiente información:
```ini
[Unit]
Description=Load kernel module at startup

[Service]
ExecStart=/usr/local/bin/load_module.sh

[Install]
WantedBy=multi-user.target
```

Por último se habilita el servicio systemd:

```bash
sudo systemctl enable load_module.service
```

Se creo tambien un archivo de unidad systemd para ejecutar el contenedor del Agente de forma automatica:
```bash
sudo nano /etc/systemd/system/mi-contenedor.service
```
Y este tendra la siguiente informacion:

```ini
[Unit]
Description=Mi Contenedor Docker
Requires=docker.service
After=docker.service

[Service]
Restart=always
ExecStart=/usr/bin/docker run --privileged --pid=host -v /proc:/proc \
-d -p 8000:8000 hugoses202002793/agent_proy1_so1

[Install]
WantedBy=multi-user.target
```
Por último se habilita el servicio con el siguiente comando:
```bash
sudo systemctl enable mi-contenedor.service
```
Teniendo todas las configuraciones se creo una imagen con el nombre **imagen-agente** a partir de la maquina virtual configurada anteriormente:
![Image_Agente](https://media.discordapp.net/attachments/764502305009303622/1155543670951522334/imagen.png?width=972&height=222)
### Creación de plantilla.

Se creo una plantilla escogiendo la imagen que se genero en el paso anterior, esta plantilla sera de utilidad para configurar nuestro grupo de instancias.
![Plantilla_disco_arranque](https://media.discordapp.net/attachments/764502305009303622/1155544781158625381/imagen.png?width=838&height=426)
![Plantilla_so1](https://media.discordapp.net/attachments/764502305009303622/1155544266572042270/imagen.png?width=972&height=222)
### Creación de grupo de instancias.

Se crea el grupo de instancias escogiendo la plantilla que se genero en el paso anterior.
![Grp_instancias_template](https://media.discordapp.net/attachments/764502305009303622/1155545617288925224/imagen.png?width=896&height=426)
También se configura la parte del autoscaling al 60% de utilización del CPU. Se configura 2 maquinas como mínimo y 4 como máximo.

![Autoscaling](https://media.discordapp.net/attachments/764502305009303622/1155546128364875826/imagen.png?width=896&height=426)
Grupo de instancias final:
![Grp_instancias_final](https://media.discordapp.net/attachments/764502305009303622/1155546349647953990/imagen.png?width=896&height=426)
