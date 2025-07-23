# 🧠 Task API - Backend Profesional con Node.js + TypeScript

Bienvenido a la API de tareas con autenticación, roles, notificaciones, subida de archivos, verificación en 2 pasos y más.  
Ideal para portafolio y como base para apps reales.

---

## 🚀 Tecnologías

- Node.js + TypeScript
- MongoDB + Mongoose
- Zod (validaciones)
- JWT (autenticación)
- WebSocket (notificaciones en tiempo real)
- Cloudinary (subida de imágenes)
- Resend (envío de correos)
- Jest (testing)
- Render (despliegue)

---

## 📦 Funcionalidades principales

- ✅ Registro + Login con JWT
- ✅ Verificación de email y verificación en 2 pasos (2FA)
- ✅ CRUD de tareas con imágenes (Cloudinary)
- ✅ Roles (`user`, `admin`) y permisos
- ✅ Panel de administración con estadísticas
- ✅ Notificaciones en tiempo real y por email
- ✅ Recuperación de cuenta por correo
- ✅ Logs de acciones y seguridad
- ✅ Rate limiting, logger y sanitizado de inputs
- ✅ Testing con Jest

---

## 🛠️ Instalación local

```bash
git clone https://github.com/tuusuario/mi-backend-api.git
cd mi-backend-api
npm install
cp .env.example .env # y completa tus variables
npm run dev

---
📬 Variables de entorno requeridas
env
Copiar
Editar
PORT=3000
MONGO_URI=tu_uri_de_mongodb
JWT_SECRET=clave_secreta
RESEND_API_KEY=tu_api_key
CLOUDINARY_CLOUD_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx
---

📮 Rutas principales
🔐 Auth
POST /register – Crea un usuario nuevo

POST /login – Login con JWT + 2FA

POST /verify-email – Verifica el correo

POST /forgot-password – Solicita recuperación

POST /reset-password – Restablece contraseña

✅ Tareas
GET /tasks – Ver tareas del usuario

POST /tasks – Crear tarea

PATCH /tasks/:id – Editar tarea

DELETE /tasks/:id – Eliminar tarea

PATCH /tasks/:id/image – Asociar imagen

⚙️ Admin
GET /admin/dashboard – Ver estadísticas

GET /admin/logs – Ver logs

DELETE /admin/users/:id – Eliminar usuarios

🌐 Despliegue
Puedes probar la API online desde:

🔗 URL: https://mi-api-tareas.onrender.com

---

🧪 Testing
bash
Copiar
Editar
npm run test
Se incluyen tests para autenticación, tareas y rutas protegidas.

---

🤝 Autor
Desarrollado por Juan Alonso – backend developer en proceso 💻🚀


⭐ Recomendación
Si te sirvió, deja una ⭐ en el repo para apoyar el proyecto 🙌

