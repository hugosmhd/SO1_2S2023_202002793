package routes

import (
	"api-go/controller"
	"github.com/gofiber/fiber/v2"
)

func Tarea6Route(app *fiber.App) {
	app.Route("/", func(router fiber.Router) {
		router.Post("/insert-album", controller.InsertData)
	})
}