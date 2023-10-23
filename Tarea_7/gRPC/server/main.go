package main

import (
	"context"
	"database/sql"
	"fmt"
	pb "server_grpc/grpcServer"
	"log"
	"net"
	"strings"

	_ "github.com/go-sql-driver/mysql"
	"google.golang.org/grpc"
)

var ctx = context.Background()
var db *sql.DB

type server struct {
	pb.UnimplementedGetInfoServer
}

const (
	port = ":3001"
)

type Data struct {
	Carnet   string  `json:"carnet"`
    Nombre   string  `json:"nombre"`
    Curso    string  `json:"curso"`
    Nota     float32 `json:"nota"`
    Semestre string  `json:"semestre"`
    Year     int32   `json:"year"`
}

func mysqlConnect() {
	// Cambia las credenciales según tu configuración de MySQL
	// Cadena de conexión a la base de datos en Cloud SQL.

    dbUser := "root"
    dbPass := "so1_usac_202002793__@"
    dbName := "so1_base2"
    cloudSQLInstance := "34.170.104.70"

	// Cadena de conexión en formato "user:password@tcp(instance)/dbname".
    connectionString := fmt.Sprintf("%s:%s@tcp(%s)/%s", dbUser, dbPass, cloudSQLInstance, dbName)
	var err error
    // Conéctate a la base de datos MySQL.
    db, err = sql.Open("mysql", connectionString)
    if err != nil {
        panic(err)
    }
    // defer db.Close()

    // Verifica la conexión.
    err = db.Ping()
    if err != nil {
        panic(err)
    }
    fmt.Println("Conexión a la base de datos MySQL en Cloud SQL establecida")
}

func insertMySQL(rank Data) {
	// Prepara la consulta SQL para la inserción en MySQL
	cursoNombre := rank.Curso
	var cursoID int
	err := db.QueryRow("SELECT curso_id FROM Cursos WHERE nombre = ?", cursoNombre).Scan(&cursoID)
	if err == sql.ErrNoRows {
		// El curso no existe, insertarlo
		result, err := db.Exec("INSERT INTO Cursos (nombre) VALUES (?)", cursoNombre)
		if err != nil {
			log.Fatal(err)
		}
		lastInsertID, err := result.LastInsertId()
		if err != nil {
			log.Fatal(err)
		}
		cursoID = int(lastInsertID)
	}

	carnet := rank.Carnet
	var alumnoCarnet int
	err = db.QueryRow("SELECT carnet FROM Alumnos WHERE carnet = ?", carnet).Scan(&alumnoCarnet)
	if err == sql.ErrNoRows {
		// El alumno no existe, insertarlo
		_, err := db.Exec("INSERT INTO Alumnos (carnet, nombre) VALUES (?, ?)",
			carnet, rank.Nombre)
		if err != nil {
			if strings.Contains(err.Error(), "Duplicate entry") {
				// Aquí puedes manejar el error de duplicado, por ejemplo, registrar un mensaje o tomar alguna otra acción.
				fmt.Println("Intento de inserción duplicada en la tabla Alumnos.")
			} else {
				log.Fatal(err)
			}
		}
	}

	_, err = db.Exec("INSERT INTO Notas (alumno_carnet, curso_id, nota, semestre, year) VALUES (?, ?, ?, ?, ?)",
		carnet, cursoID, rank.Nota, rank.Semestre, rank.Year)
	if err != nil {
		log.Fatal(err)
	}

}

func (s *server) ReturnInfo(ctx context.Context, in *pb.RequestId) (*pb.ReplyInfo, error) {
	fmt.Println("Recibí de cliente: ", in.GetCarnet())
	data := Data{
		Carnet:   in.GetCarnet(),
		Nombre:  in.GetNombre(),
		Curso:  in.GetCurso(),
		Nota: in.GetNota(),
		Semestre: in.GetSemestre(),
		Year: in.GetYear(),
	}
	fmt.Println(data)
	insertMySQL(data)
	return &pb.ReplyInfo{Info: "Hola cliente, recibí el comentario"}, nil
}

func main() {
	listen, err := net.Listen("tcp", port)
	if err != nil {
		log.Fatalln(err)
	}
	s := grpc.NewServer()
	pb.RegisterGetInfoServer(s, &server{})

	mysqlConnect()

	if err := s.Serve(listen); err != nil {
		log.Fatalln(err)
	}
}