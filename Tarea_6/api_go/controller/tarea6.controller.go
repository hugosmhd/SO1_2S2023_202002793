package controller

import (
	"github.com/gofiber/fiber/v2"
	"github.com/go-redis/redis/v8"
	"context"
	"fmt"
	"encoding/json"
)

type Colection struct {
	Album	string `json:"album"`
	Artist  string `json:"artist"`
	Year 	string `json:"year"`
}

var rdb *redis.Client // Creamos el Redis CLient

func init() {
	rdb = redis.NewClient(&redis.Options{
		Addr:     "localhost:6379", // Host de la base de Redis
		Password: "",              // contraseña Redis (Si tiene) 
		DB:       1,              // Numero de la DB
	})
}

func InsertData(c *fiber.Ctx) error{
	var album Colection
	if err := c.BodyParser(&album); err != nil {
        // Manejo de errores
        return err
    }

	albumJSON, err := json.Marshal(album)
	if err != nil {
		return err
	}

	rdb.RPush(context.Background(), "albums", string(albumJSON))

	fmt.Println("Album Registrado en Redis: ", album)

	return c.JSON(fiber.Map{
		"data": album,
	})
}