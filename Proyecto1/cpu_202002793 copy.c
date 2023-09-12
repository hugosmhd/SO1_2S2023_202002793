#include <linux/module.h>
// para usar KERN_INFO
#include <linux/kernel.h>

// Header para los macros module_init y module_exit
#include <linux/init.h>
// Header necesario porque se usara proc_fs
#include <linux/proc_fs.h>
/* for copy_from_user */
#include <asm/uaccess.h>
/* Header para usar la lib seq_file y manejar el archivo en /proc*/
#include <linux/seq_file.h>

/* libreria de memoria ram*/
// #include <linux/hugetlb.h>
#include <linux/sysinfo.h>
// Define varias estructuras y funciones relacionadas con la gestión de la memoria virtual,
#include <linux/mm.h>
// Define diferentes constantes y funciones relacionadas con el mapeo de memoria y el manejo de áreas de memoria, como
#include <linux/mman.h>
// Define estructuras y funciones relacionadas con la gestión de zonas de memoria, que son bloques de memoria contiguos y se utilizan para administrar la memoria física.
#include <linux/mmzone.h>
// Libreía para obtener datos del CPU
#include <linux/sched.h>
#include <linux/sched/signal.h>
//----------------------------------
#include <linux/cred.h>

MODULE_LICENSE("GPL");
MODULE_DESCRIPTION("Modulo de memoria RAM");
MODULE_AUTHOR("Hugo Sebastian Martínez Hernández");

struct task_struct *cpu;
struct task_struct *child;
struct list_head *lstProcess;

unsigned int valorUso_CPU(void)
{
    struct task_struct *myCpu;
    unsigned int tiempoTotal = 0;
    unsigned int tiempoUsuario, tiempoKernel, tiempoHijosUsuario, tiempoHijosKernel;
    unsigned long valor_jiffies, porcentajeUso_cpu;

    rcu_read_lock();
    for_each_process(myCpu)
    {
        if (myCpu->mm != NULL)
        {
            tiempoUsuario = myCpu->utime;                   // representa el tiempo de CPU utilizado en modo de usuario.
            tiempoHijosUsuario = myCpu->real_parent->utime; // representa el tiempo de CPU utilizado en modo de usuario por procesos hijo de esta tarea.
            tiempoKernel = myCpu->stime;                    // representa el tiempo de CPU utilizado en modo kernel.
            tiempoHijosKernel = myCpu->real_parent->stime;  // representa el tiempo de CPU utilizado en modo kernel por procesos hijo de esta tarea.
            tiempoTotal += tiempoUsuario + tiempoKernel + tiempoHijosUsuario + tiempoHijosKernel;
        }
    }
    rcu_read_unlock();

    valor_jiffies = jiffies_64_to_clock_t(HZ);

    porcentajeUso_cpu = (tiempoTotal * 100) / valor_jiffies;

    return porcentajeUso_cpu;
}

/*Funcion que se ejecutara cada vez que se lea el archivo con el comando CAT*/
static int escribir_archivo(struct seq_file *archivo, void *v)
{
    unsigned long used_ram;

    unsigned int porcentaje_cpu = valorUso_CPU();

    seq_printf(archivo, "{\n");
    seq_printf(archivo, "\t \"consumoCPu\": %u,\n", porcentaje_cpu);
    seq_printf(archivo, "\t\"procesos\": \n");
    seq_printf(archivo, "\t[\n");
    for_each_process(cpu)
    {
        seq_printf(archivo, "\t{\n");
        if (cpu->mm)
        {
            // Ram de uso real
            used_ram = get_mm_rss(cpu->mm);
            // Convertir la cantidad de memoria utilizada a bytes
            used_ram *= PAGE_SIZE;
            seq_printf(archivo, "\t \"ram_consumo\": %ld,\n", used_ram);
        }
        else
        {
            seq_printf(archivo, "\t \"ram_consumo\": %ld,\n", 00);
        }
        seq_printf(archivo, "\t \"pid\": %d,\n", cpu->pid);
        seq_printf(archivo, "\t \"name\": \"%s\",\n", cpu->comm);
        seq_printf(archivo, "\t \"user_id\": \"%d\",\n", cpu->cred->uid.val);
        seq_printf(archivo, "\t \"state\": %d,\n", cpu->__state);
        seq_printf(archivo, "\t \"pid_papa\": %d,\n", cpu->parent->pid);
        // Los hijos que tiene el proceso actual
        seq_printf(archivo, "\t\"hijos\": \n");
        seq_printf(archivo, "\t [\n");
        list_for_each(lstProcess, &(cpu->children))
        {
            seq_printf(archivo, "\t\t{\n");
            child = list_entry(lstProcess, struct task_struct, sibling);
            seq_printf(archivo, "\t\t \"hijo_pid\": %d,\n", child->pid);
            seq_printf(archivo, "\t\t \"hijo_nombre\": \"%s\"\n", child->comm);

            if (lstProcess->next == &(cpu->children))
            {
                seq_printf(archivo, "\t\t}\n");
            }
            else
            {
                seq_printf(archivo, "\t\t},\n");
            }
        }
        seq_printf(archivo, "\t ]\n");

        seq_printf(archivo, "\t},\n");
    }
    seq_printf(archivo, "]\n");
    seq_printf(archivo, "}\n");
    return 0;
}

// Funcion que se ejecutara cada vez que se lea el archivo con el comando CAT
static int al_abrir(struct inode *inode, struct file *file)
{
    return single_open(file, escribir_archivo, NULL);
}

// Si el kernel es 5.6 o mayor se usa la estructura proc_ops
static struct proc_ops operaciones =
    {
        .proc_open = al_abrir,
        .proc_read = seq_read};

// Funcion a ejecuta al insertar el modulo en el kernel con insmod
static int _insert(void)
{
    proc_create("cpu_202002793", 0, NULL, &operaciones);
    printk(KERN_INFO "202002793\n");
    return 0;
}

// Funcion a ejecuta al remover el modulo del kernel con rmmod
static void _remove(void)
{
    remove_proc_entry("cpu_202002793", NULL);
    printk(KERN_INFO "Hugo Sebastian Martínez Hernández\n");
}

module_init(_insert);
module_exit(_remove);