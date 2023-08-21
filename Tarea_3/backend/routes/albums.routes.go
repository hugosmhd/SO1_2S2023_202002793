package routes

import (
	"api-go/controller"
	"github.com/gofiber/fiber/v2"
)

func UseAlbumsRoute(app *fiber.App) {
	app.Route("/albums", func(router fiber.Router) {
		router.Get("/", controller.GetAllAlbums)
		router.Post("/", controller.CreateAlbum)
	})

	
}