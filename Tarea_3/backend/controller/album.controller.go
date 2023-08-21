package controller

import (
	"github.com/gofiber/fiber/v2"

	"api-go/Entities"
	"api-go/Config"
)

func GetAllAlbums(c *fiber.Ctx) error {
	var albums [] Entities.Album_collection
    Config.Database.Find(&albums)
	if albums == nil {
		c.JSON(fiber.Map{
			"albums": []Entities.Album_collection{},
		})
	}
	return c.JSON(fiber.Map{
		"albums": albums,
	})
}

func CreateAlbum(c *fiber.Ctx) error {
	var payload *Entities.CreateAlbumSchema
	
	if err := c.BodyParser(&payload); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"status": "fail", "message": err.Error()})
	}

	errors := Entities.ValidateStruct(payload)
	if errors != nil {
		return c.Status(fiber.StatusBadRequest).JSON(errors)

	}

	newAlbum := Entities.Album_collection{
		Title: payload.Title,
		Artist: payload.Artist,
		Year: payload.Year,
		Genre: payload.Genre,
	}

	Config.Database.Create(&newAlbum)

	return c.JSON(fiber.Map{
		"albums": "albums",
	})
}