package Config

import (
	// "log"
	// "os"
	// "fmt"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	// "github.com/joho/godotenv"

	"api-go/Entities"
)

// var dsn = "root:secret@tcp(base:3306)/tarea3?charset=utf8&parseTime=True&loc=Local"
var Database *gorm.DB
var Uri = "root:secret@tcp(db_t3:3306)/tarea3?charset=utf8&parseTime=True&loc=Local"

func Connect() error {

	// err_env := godotenv.Load()
	// if err_env != nil {
	// 	log.Fatal("Error loading .env file")
	// }

	// dbUser := os.Getenv("DB_USER")
	// dbPassword := os.Getenv("DB_PASSWORD")
	// dbHost := os.Getenv("DB_HOST")
	// dbPort := os.Getenv("DB_PORT")
	// dbName := os.Getenv("DB_NAME")

	// dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?parseTime=true", dbUser, dbPassword, dbHost, dbPort, dbName)

	// fmt.Println("Holaaaaaaaaaa")
	// fmt.Println(dbHost)
	// fmt.Println(dbUser)

	// dsn := "root:secret@tcp(MYSQL_Base:3306)/tarea3?charset=utf8&parseTime=True"
	// var err error

	// db, err := gorm.Open(mysql.Open(Uri), &gorm.Config{})
	// if err != nil {
	// 	log.Fatal("Failed to connect to the Database! \n", err.Error())
	// 	// os.Exit(1)
	// 	panic(err)
	// }

	// err = db.AutoMigrate(&Entities.Album_collection{})
	// if err != nil {
	// 	return err
	// }
	// Database = db

	// return nil

	// db, err := gorm.Open(mysql.Open(Uri), &gorm.Config{
	// 	SkipDefaultTransaction: true,
	// 	PrepareStmt:            true,
	// })
	// if err != nil {
	// 	panic("Error connecting to database")
	// }

	// // Cierra la conexión con la base de datos al final del programa
	// sqlDB, err := db.DB()
	// if err != nil {
	// 	panic("Error getting DB instance")
	// }
	// defer sqlDB.Close()

	// // Ahora puedes usar la variable 'db' para realizar operaciones con GORM
	// fmt.Println("Connected to MySQL database")

	var err error

	Database, err = gorm.Open(mysql.Open(Uri), &gorm.Config{
		SkipDefaultTransaction: true,
		PrepareStmt:            true,
	})
	if err != nil {
		panic(err)
	}

	err = Database.AutoMigrate(&Entities.Album_collection{})
	if err != nil {
		return err
	}

	return nil
}