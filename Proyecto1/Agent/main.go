package main

import (
    "fmt"
    "net/http"
    "bytes"
    "encoding/json"
    "time"
)

func main() {
    done := make(chan bool)

    go func() {
        send_data()
        done <- true
    }()

    // Ejecutar durante 500 segundos
    select {
    case <-time.After(2 * time.Second):
        fmt.Println("Tiempo de ejecución alcanzado.")
    case <-done:
        fmt.Println("send_data finalizado.")
    }
}

func send_data() {
    ticker := time.NewTicker(1 * time.Second)
    defer ticker.Stop()

    for {
        select {
        case <-ticker.C:
            fmt.Println("Bienvenidos al enviar")
            url := "http://localhost:3000/guardar-datos" // Cambia la URL según tu configuración

            data := map[string]interface{}{
                "nombre":  "Ejemplo",
                "edad":    30,
                "ciudad":  "Ejemploville",
            }

            jsonData, err := json.Marshal(data)
            if err != nil {
                fmt.Println("Error al serializar los datos:", err)
                continue // Continuar con el próximo ciclo
            }
            resp, err := http.Post(url, "application/json", bytes.NewBuffer(jsonData))
            if err != nil {
                fmt.Println("Error al enviar los datos:", err)
                continue // Continuar con el próximo ciclo
            }
            defer resp.Body.Close()

            if resp.StatusCode == http.StatusCreated {
                fmt.Println("Datos guardados con éxito")
            } else {
                fmt.Println("Error al guardar los datos. Código de estado:", resp.StatusCode)
            }
        }
    }
}

// package main

// import (
// 	"encoding/json"
// 	"fmt"
// 	"os/exec"
// 	// "strings"
// 	"time"
// 	"net/http"
// 	"bytes"
// )

// type Child struct {
// 	HijoPid    int    `json:"hijo_pid"`
// 	HijoNombre string `json:"hijo_nombre"`
// }

// type Proceso struct {
// 	RamConsumo float64 `json:"ram_consumo"`
// 	Pid        int     `json:"pid"`
// 	Pid_padre   int     `json:"pid_padre"`
// 	Nombre     string  `json:"nombre"`
// 	UserId     string  `json:"user_id"`
// 	Estado      int     `json:"estado"`
// 	Hijos      []Child `json:"hijos"`
// }

// type DatosCPU struct {
// 	Porcentaje_cpu float64   `json:"porcentaje_cpu"`
// 	Procesos   []Proceso `json:"procesos"`
// }

// type DatosRAM struct {
// 	Total_ram float64
// 	Ram_en_uso float64
// 	Ram_libre float64
// 	Porcentaje_en_uso float64
// }

// // func GetCpu(cpu string) DatosCPU {
// // 	datos := DatosCPU{}
// // 	err := json.Unmarshal([]byte(cpu), &datos)
// // 	if err != nil {
// // 		fmt.Println("Error:", err)
// // 	}
// // 	return datos
// // }

// func main() {
// 	go send_data()
//     time.Sleep(time.Second * 500)
// }

// func send_data() {
// 	ticker := time.NewTicker(1 * time.Second)
//     defer ticker.Stop()

//     for {
//         select {
//         case <-ticker.C:
//             fmt.Println("Bienvenidos al enviar")
//             url := "http://localhost:3000/guardar-datos" // Cambia la URL según tu configuración

//             data := map[string]interface{}{
//                 "nombre":  "Ejemplo",
//                 "edad":    30,
//                 "ciudad":  "Ejemploville",
//             }

//             jsonData, err := json.Marshal(data)
//             if err != nil {
//                 fmt.Println("Error al serializar los datos:", err)
//                 continue // Continuar con el próximo ciclo
//             }
//             resp, err := http.Post(url, "application/json", bytes.NewBuffer(jsonData))
//             if err != nil {
//                 fmt.Println("Error al enviar los datos:", err)
//                 continue // Continuar con el próximo ciclo
//             }
//             defer resp.Body.Close()

//             if resp.StatusCode == http.StatusCreated {
//                 fmt.Println("Datos guardados con éxito")
//             } else {
//                 fmt.Println("Error al guardar los datos. Código de estado:", resp.StatusCode)
//             }
//         }
//     }
// }

// func repeat_cpu() {
// 	for range time.Tick(time.Second * 1) {
// 		get_module_cpu()
// 	}
// }

// func repeat_ram() {
// 	for range time.Tick(time.Second * 1) {
// 		get_module_ram()
// 	}
// }

// func get_module_cpu() {
// 	cmd2 := exec.Command("sh", "-c", "cat /proc/cpu_202002793")
// 	cpu_data, cpu_err := cmd2.CombinedOutput()
// 	if cpu_err != nil {
// 		fmt.Println(cpu_err)
// 	}

// 	//Get the data from the CPU
// 	cpu_output := string(cpu_data[:])
// 	datos := DatosCPU{}
// 	err := json.Unmarshal([]byte(cpu_output), &datos)
// 	if err != nil {
// 		fmt.Println("Error:", err)
// 	}
// 	// cpu_procesado := GetCpu(result)                             //Obtenemos los datos como json del cpu

// 	fmt.Println(datos)
// }

// func get_module_ram() {
// 	cmd := exec.Command("sh", "-c", "cat /proc/ram_202002793")
// 	output, ram_err := cmd.CombinedOutput()
// 	if ram_err != nil {
// 		fmt.Println(ram_err)
// 	}
// 	ram_output := string(output[:])

// 	datos := DatosRAM{}
// 	err := json.Unmarshal([]byte(ram_output), &datos)
// 	if err != nil {
// 		fmt.Println("Error:", err)
// 	}

// 	fmt.Print(datos)
// }