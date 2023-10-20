**Aprende a desplegar tus aplicaciones en Google Kubernetes Engine (GKE)**

_Expositora: Yolanda Lopez_

Fue una conferencia de bastante interés y relacionada cien por ciento con los temas del curso. El tema de Kubernetes que en la actualidad esta tomando mucho auge y que nos será de utilidad para el segundo proyecto del curso. En la conferencia se trataron temas puntuales que se describirán a continuación:

# Kubernetes
Kubernetes es una plataforma para la orquestación de contenedores que fue desarrollado por Google. Kubernetes es una herramienta que se ha ido buscando su espacio en el mundo de la computación en la nube y la gestión de aplicaciones distribuidas. Además, esta plataforma es muy robusta y es escalable para administrar aplicaciones en clusters de servidores.

## Configuración declarativa
Se menciono que Kubernetes se define el estado de las aplicaciones y recursos con los archivos YAML, en lugar de especificar comandos para llegar a ese estado. A lo anterior se le conoce como configuración declarativa.

## Pods
Estas son las unidades más pequeñas y básicas en el despliegue en Kubernetes. Un Pod básicamente representa un único proceso en un cluster de Kubernetes y además puede contener uno o varios contenedores que comparten el mismo espacio en red y almacenamiento.

## Cluster
Son un conjunto de maquinas virtuales que trabajan en conjunto para brindar una plataforma de administración y ejecución para apliaciones en contenedores.

## Kubernetes Master
Este es un componente y es el componente central de control del cluster. Este comopnente esta compuesto por otros componentes dentro de los que podemos mencionar: API Server, que es la interfaz a través de la cual los usuarios y las herramientas se comunican con el cluster; Control Plane, que se encarga de gestionar y tomar decisiones sobre el estado del cluster; y por último el etcd es un almacén de datos distribuidos que almacena la configuración del cluster.

## Load Balancer
Es otro componente que se encarga de distribuir la carga y distribuir el trafico de red entrante entre varios Pods que ejecutan la misma aplicación. Entre las funciones que tiene es mejorar la disponibilidad, la escalabilidad y la resistencia de las aplicaciones distribuidas esto gracias a que las cargas se distribuyen de forma uniforme entre múltiples instancias de una aplicación, lo que garantiza que ninguna instancia este sobrecargada.

Dentro de la conferencia se dio un pequeño ejemplo básico en el cual se mostro un sistema de votaciones entre dos animales: Perros y gatos. Aunque fue un ejemplo básico y con explicación un poco por encima por cuestiones de tiempo, fue un ejemplo interesante donde se mostro como desplegar la aplicación. Esta conferencia fue de mucho provecho no solo para temas del curso si no también para poder aprender mas sobre el tema que como se mencionó hoy en día es muy utilizado ya en ambientes laborales.

## Fotografías
![Conferencia GKE](https://media.discordapp.net/attachments/764502305009303622/1164931237232779356/image.png?ex=654501c2&is=65328cc2&hm=1add496907c4aff9bccb76e6e9b6a26f4d3e0566db28cba81701ba2f4f2004eb&=)
![Yo en la conferencia](https://media.discordapp.net/attachments/764502305009303622/1164931403520151552/image.png?ex=654501e9&is=65328ce9&hm=6981e900f93aca78b680d9b8ad7c33c2ccc68be677ed68f45854c1e3c18f462b&=)