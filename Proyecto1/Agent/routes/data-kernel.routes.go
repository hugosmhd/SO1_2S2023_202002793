package routes

import (
	"api-go/controller"
	"github.com/gofiber/fiber/v2"
)

func UseDataKernelRoute(app *fiber.App) {
	app.Route("/", func(router fiber.Router) {
		router.Get("/data-kernel", controller.GetDataKernel)
		router.Delete("/kill-proc/:id", controller.KillProc)
	})
}