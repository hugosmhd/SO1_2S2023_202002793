package main

import (
	"encoding/json"
	"fmt"
	"os/exec"
	"strings"
	"time"
)

type Child struct {
	HijoPid    int    `json:"hijo_pid"`
	HijoNombre string `json:"hijo_nombre"`
}

type Proceso struct {
	RamConsumo float64 `json:"ram_consumo"`
	Pid        int     `json:"pid"`
	Pid_papa   int     `json:"pid_papa"`
	Nombre     string  `json:"name"`
	UserId     string  `json:"user_id"`
	State      int     `json:"state"`
	Hijos      []Child `json:"hijos"`
}

type DatosCPU struct {
	ConsumoCPu float64   `json:"consumoCPu"`
	Procesos   []Proceso `json:"procesos"`
}

type DatosRAM struct {
	Total      float64
	Used       float64
	Free       float64
	Percentage float64
}

// func GetCpu(cpu string) DatosCPU {
// 	datos := DatosCPU{}
// 	err := json.Unmarshal([]byte(cpu), &datos)
// 	if err != nil {
// 		fmt.Println("Error:", err)
// 	}
// 	return datos
// }

func main() {

	for {
		time.Sleep(1500 * time.Millisecond)
		//running command to get module cpu from proc directory
		cmd2 := exec.Command("sh", "-c", "cat /proc/cpu_202010025")
		cpu_data, cpu_err := cmd2.CombinedOutput()
		if cpu_err != nil {
			fmt.Println(cpu_err)
		}

		//Get the data from the CPU
		cpu_output := string(cpu_data[:])
		lastComma := strings.LastIndex(cpu_output, ",")             // Encontrar la posición de la última coma en el string
		result := cpu_output[:lastComma] + cpu_output[lastComma+1:] // Crear un nuevo string que excluya la última coma
		datos := DatosCPU{}
		err := json.Unmarshal([]byte(result), &datos)
		if err != nil {
			fmt.Println("Error:", err)
		}
		// cpu_procesado := GetCpu(result)                             //Obtenemos los datos como json del cpu

		fmt.Println(datos)

		//Guardamos los datos
		// save_Datos(ram_procesado, cpu_procesado)
		//------------------------------------

	}
}