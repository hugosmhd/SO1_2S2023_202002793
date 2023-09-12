package main

import (
	"time"
	"fmt"
	"os/exec"
	// "encoding/json"
	// "strings"
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
	Total_ram float64
	Ram_en_uso float64
	Ram_libre float64
	Porcentaje_en_uso float64
}

func main() {
	// go repeat_ram()
	go repeat_cpu()
	time.Sleep(time.Second *500)
}

// func repeat_ram() {
// 	for range time.Tick(time.Second * 1) {
// 		get_module_ram()
// 	}
// }

func repeat_cpu() {
	for range time.Tick(time.Second * 1) {
		get_module_cpu()
	}
}

// func get_module_ram() {
// 	cmd := exec.Command("sh", "-c", "cat /proc/ram_202002793")
// 	output, err := cmd.CombinedOutput()
// 	if err != nil {
// 		fmt.Println(err)
// 	}
// 	out := string(output[:])

// 	var data_json_ram map[string]interface{}
// 	data_json_ram_err := json.Unmarshal([]byte(out), &data_json_ram)
// 	if data_json_ram_err != nil {
// 		panic(data_json_ram_err)
// 	}
// 	total_ram := data_json_ram["total_ram"].(float64)
// 	ram_en_uso := data_json_ram["ram_en_uso"].(float64)
// 	ram_libre := data_json_ram["ram_libre"].(float64)
// 	porcentaje_en_uso := data_json_ram["porcentaje_en_uso"].(float64)

// 	// fmt.Print("total_ram: ", total_ram)
// 	// fmt.Print("ram_en_uso: ", ram_en_uso)
// 	// fmt.Print("ram_libre: ", ram_libre)
// 	// fmt.Print("porcentaje_en_uso: ", porcentaje_en_uso)

// 	// fmt.Print(ram_en_uso)
// 	// fmt.Print(ram_libre)
// 	// fmt.Print(porcentaje_en_uso)

// 	enviar := DatosRAM{Total_ram: total_ram, Ram_en_uso: ram_en_uso, Ram_libre: ram_libre, Porcentaje_en_uso: porcentaje_en_uso,}
// 	output2, err2 := json.MarshalIndent(enviar, "", "    ")
// 	if err2 != nil {
// 		fmt.Println(err2)
// 		return
// 	}

// 	fmt.Print(string(output2))
// }

func get_module_cpu() {
	cmd := exec.Command("sh", "-c", "cat /proc/cpu_202002793")
	output, err := cmd.CombinedOutput()
	if err != nil {
		fmt.Println(err)
	}
	out := string(output[:])
	// lastComma := strings.LastIndex(out, ",")             // Encontrar la posición de la última coma en el string
	// result := out[:lastComma] + out[lastComma+1:]

	// var data_json_ram map[string]interface{}
	// data_json_ram := DatosCPU{}
	// data_json_ram_err := json.Unmarshal([]byte(out), &data_json_ram)
	// if data_json_ram_err != nil {
	// 	fmt.Println("Error:", data_json_ram_err)
	// 	panic(data_json_ram_err)
	// }

	fmt.Print(out)
	// total_ram := data_json_ram["total_ram"].(float64)
	// ram_en_uso := data_json_ram["ram_en_uso"].(float64)
	// ram_libre := data_json_ram["ram_libre"].(float64)
	// porcentaje_en_uso := data_json_ram["porcentaje_en_uso"].(float64)

	// fmt.Print("total_ram: ", total_ram)
	// fmt.Print("ram_en_uso: ", ram_en_uso)
	// fmt.Print("ram_libre: ", ram_libre)
	// fmt.Print("porcentaje_en_uso: ", porcentaje_en_uso)

	// fmt.Print(ram_en_uso)
	// fmt.Print(ram_libre)
	// fmt.Print(porcentaje_en_uso)

	// enviar := DatosRAM{Total_ram: total_ram, Ram_en_uso: ram_en_uso, Ram_libre: ram_libre, Porcentaje_en_uso: porcentaje_en_uso,}
	// output2, err2 := json.MarshalIndent(enviar, "", "    ")
	// if err2 != nil {
	// 	fmt.Println(err2)
	// 	return
	// }

	// fmt.Print(string(output2))
}