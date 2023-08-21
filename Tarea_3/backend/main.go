package main

import (
	"log"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"

	"api-go/routes"
	"api-go/Config"
)

func init() {
	err := Config.Connect()
	if err != nil {
		log.Fatalln("Error ", err)
	}
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
	routes.UseAlbumsRoute(app)

	app.Listen(":8000")
}

/*
COMANDOS
go get github.com/gofiber/fiber/v2 // para instalar fiber
go mod init api-go  // para iniciar el gestor de paquetes de go

*/