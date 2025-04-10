package main

import (
	"context"
	pb "client-grpc/grpcClient"
	"fmt"
	"log"

	"github.com/gofiber/fiber/v2"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
)

var ctx = context.Background()

type Data struct {
	Carnet   int32  `json:"carnet"`
    Nombre   string  `json:"nombre"`
    Curso    string  `json:"curso"`
    Nota     float32 `json:"nota"`
    Semestre string  `json:"semestre"`
    Year     int32   `json:"year"`
}


func insertData(c *fiber.Ctx) error {
	var payload *Data
	
	if err := c.BodyParser(&payload); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"status": "fail", "message": err.Error()})
	}

	rank := Data{
		Carnet:  payload.Carnet,
		Nombre:   payload.Nombre,
		Curso: payload.Curso,
		Nota:     payload.Nota,
		Semestre: payload.Semestre,
		Year:     payload.Year,
	}

	go sendMysqlServer(rank)
	return nil
}

func sendMysqlServer(rank Data) {
	conn, err := grpc.Dial("localhost:3001", grpc.WithTransportCredentials(insecure.NewCredentials()),
		grpc.WithBlock())
	if err != nil {
		log.Fatalln(err)
	}

	cl := pb.NewGetInfoClient(conn)
	defer func(conn *grpc.ClientConn) {
		err := conn.Close()
		if err != nil {
			log.Fatalln(err)
		}
	}(conn)

	ret, err := cl.ReturnInfo(ctx, &pb.RequestId{
		Carnet: rank.Carnet,
		Nombre:  rank.Nombre,
		Curso:   rank.Curso,
		Nota: rank.Nota,
		Semestre: rank.Semestre,
		Year: rank.Year,
	})
	if err != nil {
		log.Fatalln(err)
	}

	fmt.Println("Respuesta del server " + ret.GetInfo())
}

func main() {
	app := fiber.New()
	
	app.Get("/", func(c *fiber.Ctx) error {
        return c.Status(200).SendString("hello, world go!")
    })
	app.Post("/insert", insertData)

	err := app.Listen(":3800")
	if err != nil {
		return
	}
}