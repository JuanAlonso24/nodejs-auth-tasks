import z from "zod";

// Create Task

const taskSchema = z.object({
  title: z.string().min(1, "El titulo es obligatorio").optional(),
  description: z
    .string()
    .min(5, "La descripcion debe tener al menos 5 caracteres")
    .optional(),
  completed: z.boolean().optional(),
});

// Actualizar tarea -- todos los campos opcionales.
export const updateTaskSchema = z.object({
  title: z.string().min(1, "Titulo es obligatorio").optional(),
  description: z
    .string()
    .min(5, "La descripcion debe de tener al menos 5 caracteres")
    .optional(),
  completed: z.boolean().optional(),
});

// Usar el esquema para validar una tarea

export function validateTask(task: any) {
  return taskSchema.safeParse(task);
}

// Funcion para validar Actualizacion.
export function validateTaskUpdate(task: any) {
  return updateTaskSchema.safeParse(task);
}
