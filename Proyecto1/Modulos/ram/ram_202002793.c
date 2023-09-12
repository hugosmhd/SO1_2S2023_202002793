// Info de los modulos
#include <linux/module.h>   //
// Info del kernel en tiempo real
#include <linux/kernel.h>   //
#include <linux/sched.h>   

// Headers para modulos
#include <linux/init.h> //
// Header necesario para proc_fs
#include <linux/proc_fs.h>  //
// Para dar acceso al usuario
#include <asm/uaccess.h>    //
// Para manejar el directorio /proc
#include <linux/seq_file.h> //
// Para get_mm_rss
#include <linux/mm.h>   //
//Se obtiene información del sistema
#include <linux/sysinfo.h>  //
//Define diferentes constantes y funciones relacionadas con el mapeo de memoria y el manejo de áreas de memoria, como
#include <linux/mman.h> //
//Define estructuras y funciones relacionadas con la gestión de zonas de memoria, que son bloques de memoria contiguos y se utilizan para administrar la memoria física.
#include <linux/mmzone.h>   //

MODULE_LICENSE("GPL");
MODULE_DESCRIPTION("Modulo de memoria RAM");
MODULE_AUTHOR("Hugo Sebastian Martínez Hernández");

static int escribir_archivo(struct seq_file *archivo, void *v)
{
    struct sysinfo myram_info;
    unsigned long total_ram, ram_libre, ram_en_uso;

    si_meminfo(&myram_info);

    total_ram = myram_info.totalram * myram_info.mem_unit;
    ram_libre = myram_info.freeram * myram_info.mem_unit;
    ram_en_uso = total_ram - ram_libre;

    seq_printf(archivo, "{\n");
    seq_printf(archivo, "\t \"total_ram\": %lu,\n", total_ram);
    seq_printf(archivo, "\t \"ram_en_uso\": %lu,\n", ram_en_uso);
    seq_printf(archivo, "\t \"ram_libre\": %lu,\n", ram_libre);
    seq_printf(archivo, "\t \"porcentaje_en_uso\": %li\n", (ram_en_uso*100)/total_ram);
    seq_printf(archivo, "} \n");

    return 0;
}

//Funcion que se ejecutara cada vez que se lea el archivo con el comando CAT
static int al_abrir(struct inode *inode, struct file *file)
{
    return single_open(file, escribir_archivo, NULL);
}

//Si el kernel es 5.6 o mayor se usa la estructura proc_ops
static struct proc_ops operaciones =
{
    .proc_open = al_abrir,
    .proc_read = seq_read
};

//Funcion a ejecuta al insertar el modulo en el kernel con insmod
static int _insert(void)
{
    proc_create("ram_202002793", 0, NULL, &operaciones);
    printk(KERN_INFO "202002793\n");
    return 0;
}

//Funcion a ejecuta al remover el modulo del kernel con rmmod
static void _remove(void)
{
    remove_proc_entry("ram_202002793", NULL);
    printk(KERN_INFO "Hugo Sebastian Martínez Hernández\n");
}

module_init(_insert);
module_exit(_remove);