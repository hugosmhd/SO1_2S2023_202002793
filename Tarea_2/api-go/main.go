package main

import "github.com/gofiber/fiber/v2"


func main() {
	
	app := fiber.New()

	app.Get("/data", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"carnet": 202002793,
			"nombre": "Hugo Sebastian Martínez Hernández",
		})
	})

	app.Listen(":4000")
}

/*
COMANDOS
go mod init api-go

*/