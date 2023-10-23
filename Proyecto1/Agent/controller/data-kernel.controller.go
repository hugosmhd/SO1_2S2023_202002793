package controller

import (
	"github.com/gofiber/fiber/v2"
	"fmt"
	"encoding/json"
	"os/exec"
	"encoding/json"
)

type Children struct {
	HijoPid    int    `json:"hijo_pid"`
	HijoNombre string `json:"hijo_nombre"`
	Estado int `json:"estado"`
	RamConsumo int `json:"ram_consumo"`
}

type Proceso struct {
	RamConsumo float64 `json:"ram_consumo"`
	Pid        int     `json:"pid"`
	Pid_padre   int     `json:"pid_padre"`
	Nombre     string  `json:"nombre"`
	UserId     string  `json:"user_id"`
	Estado      int     `json:"estado"`
	Hijos      []Children `json:"hijos"`
}

type DatosCPU struct {
	Porcentaje_cpu float64   `json:"porcentaje_cpu"`
	Procesos   []Proceso `json:"procesos"`
}

type DatosRAM struct {
	Total_ram float64
	Ram_en_uso float64
	Ram_libre float64
	Porcentaje_en_uso float64
}

func GetDataKernel(c *fiber.Ctx) error {
	data_ram := get_module_ram()
	data_cpu := get_module_cpu()

	return c.JSON(fiber.Map{
		"data_ram": data_ram,
		"data_cpu": data_cpu,
	})
}

func get_module_cpu()DatosCPU {
	cmd2 := exec.Command("sh", "-c", "cat /proc/cpu_202002793")
	cpu_data, cpu_err := cmd2.CombinedOutput()
	if cpu_err != nil {
		fmt.Println(cpu_err)
	}

	cpu_output := string(cpu_data[:])
	datos := DatosCPU{}
	err := json.Unmarshal([]byte(cpu_output), &datos)
	if err != nil {
		fmt.Println("Error:", err)
	}

	return datos
}

func get_module_ram()DatosRAM {
	cmd := exec.Command("sh", "-c", "cat /proc/ram_202002793")
	output, ram_err := cmd.CombinedOutput()
	if ram_err != nil {
		fmt.Println(ram_err)
	}
	ram_output := string(output[:])

	datos := DatosRAM{}
	err := json.Unmarshal([]byte(ram_output), &datos)
	if err != nil {
		fmt.Println("Error:", err)
	}

	return datos
}

func KillProc(c *fiber.Ctx) error{
	id, _ := c.ParamsInt("id")
	comando := fmt.Sprint("kill ", id, " -9")
	cmd := exec.Command("sh", "-c", comando)
	_, err := cmd.CombinedOutput()

	if err != nil {
		fmt.Println("Error:", err)
	}

	data_ram := get_module_ram()
	data_cpu := get_module_cpu()

	return c.JSON(fiber.Map{
		"data_ram": data_ram,
		"data_cpu": data_cpu,
	})
}