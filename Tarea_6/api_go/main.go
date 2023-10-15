package main

import (
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"api-go/routes"
)

func main() {
	app := fiber.New()
	app.Use(logger.New())
	app.Use(cors.New(cors.Config{
		AllowOrigins:     "*",
		AllowHeaders:     "Origin, Content-Type, Accept",
		AllowMethods:     "GET, POST, PATCH, DELETE",
		AllowCredentials: true,
	}))
	
	routes.Tarea6Route(app)

	app.Listen(":8000")
}

// go mod tidy

// {
//     "album": "Magical Mystery Tour",
//     "artist": "The Beatles",
//     "year": "1967"
// }
// {
// 	"album": "Sgt. Pepper's Lonely Hearts Club Band",
// 	"artist": "The Beatles",
// 	"year":	"1967"
// }
// {
// 	"album": "The Dark Side of the Moon",
// 	"artist": "Pink Floyd",
// 	"year": "1973"
// }
// {
// 	"album": "Alma",
// 	"artist": "Nicky Nicole",
// 	"year": "2023"
// }
// {
// 	"album": "Quinto Piso",
// 	"artist": "Arjona",
// 	"year": "2010"
// }