package main

import (
	// "log"
	"fmt"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	// "net/http"
	// "bytes"
	// "time"
	"api-go/routes"
)

func init() {
	fmt.Println("Hola init")
	// apiUrl := "http://localhost:3000/" // Reemplaza esto con la URL de tu API en Node.js

    // for {
    //     response, err := http.Post(apiUrl, "", nil)
    //     if err != nil {
    //         fmt.Println("Error al hacer la solicitud:", err)
    //         time.Sleep(5 * time.Second) // Espera 5 segundos antes de volver a intentar
    //         continue
    //     }
    //     defer response.Body.Close()

    //     if response.StatusCode == http.StatusOK {
    //         // Hemos recibido una respuesta exitosa
    //         fmt.Println("Respuesta exitosa:", response.Status)
    //         break // Sal del bucle
    //     } else {
    //         fmt.Println("Respuesta no exitosa:", response.Status)
    //         time.Sleep(5 * time.Second) // Espera 5 segundos antes de volver a intentar
    //     }
    // }
}

func main() {
	app := fiber.New()
	app.Use(logger.New())
	app.Use(cors.New(cors.Config{
		AllowOrigins:     "*",
		AllowHeaders:     "Origin, Content-Type, Accept",
		AllowMethods:     "GET, POST, PATCH, DELETE",
		AllowCredentials: true,
	}))

	// use router albums
	routes.UseDataKernelRoute(app)

	app.Listen(":8000")
}

/*
COMANDOS
go get github.com/gofiber/fiber/v2 // para instalar fiber
go mod init api-go  // para iniciar el gestor de paquetes de go

*/