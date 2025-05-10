# 🛠️ API de Autenticación y Gestión de Tareas

Este es un mini proyecto backend desarrollado con **Node.js** y **TypeScript** que permite a los usuarios autenticarse (con JWT), crear tareas, obtenerlas, actualizarlas y eliminarlas. Incluye protección de rutas, roles y conexión a MongoDB.

---

## 🚀 Tecnologías utilizadas

- Node.js
- TypeScript
- MongoDB + Mongoose
- JSON Web Tokens (JWT)
- HTTP nativo (sin frameworks)

---

## 📦 Instalación

1. Clona el repositorio:

```bash
git clone https://github.com/TU_USUARIO/TU_REPO.git
cd TU_REPO
```
2.- Instala Dependencias 
npm install

3.- Crea el archivo .env
MONGO_URI=mongodb://localhost:27017/tu_basededatos
SECRET_KEY=tu_clave_secreta
PORT=3000

4.- Corre el servidor
npm run dev 

🧪 Endpoints disponibles
Auth
Método	Ruta	Descripción
POST	/register	Registrar nuevo usuario
POST	/login	Login y recibir token

Tareas
Todas protegidas con JWT (Authorization: Bearer "token")

Método	Ruta	Descripción
POST	/tasks	Crear nueva tarea
GET	/tasks	Obtener todas las tareas
GET	/tasks/user	Obtener tareas del usuario autenticado
PUT	/tasks/:id	Actualizar una tarea por ID
DELETE	/tasks/:id	Eliminar una tarea por ID

🔐 Roles
Los usuarios tienen rol user o admin.

Puedes extender lógica de permisos fácilmente.

✍️ Autor
Desarrollado por Juan Alonso.
