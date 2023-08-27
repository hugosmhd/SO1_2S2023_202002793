package main

import (
	"time"
	"fmt"
	"os/exec"
	"encoding/json"
)

type DatosRAM struct {
	Total_Ram float64
	Ram_en_Uso float64
	Ram_libre float64
	Porcentaje_en_uso float64
}

func main() {
	go repeat_ram()
	time.Sleep(time.Second *500)
}

func repeat_ram() {
	for range time.Tick(time.Second * 1) {
		get_module_ram()
	}
}

func get_module_ram() {
	cmd := exec.Command("sh", "-c", "cat /proc/ram_202002793")
	output, err := cmd.CombinedOutput()
	if err != nil {
		fmt.Println(err)
	}
	out := string(output[:])

	var data_json_ram map[string]interface{}
	data_json_ram_err := json.Unmarshal([]byte(out), &data_json_ram)
	if data_json_ram_err != nil {
		panic(data_json_ram_err)
	}
	total_ram := data_json_ram["Total_Ram"].(float64)
	ram_en_uso := data_json_ram["Ram_en_uso"].(float64)
	ram_libre := data_json_ram["Ram_libre"].(float64)
	porcentaje_en_uso := (data_json_ram["Ram_en_uso"].(float64) * 100) / data_json_ram["Total_Ram"].(float64)

	enviar := DatosRAM{Total_Ram: total_ram, Ram_en_Uso: ram_en_uso, Ram_libre: ram_libre, Porcentaje_en_uso: porcentaje_en_uso,}
	output2, err2 := json.MarshalIndent(enviar, "", "    ")
	if err2 != nil {
		fmt.Println(err2)
		return
	}

	fmt.Print(string(output2))
}