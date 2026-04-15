# 🏫 Project Specification — School Management System

## 📌 Overview

Plataforma web institucional para escuelas primarias que permite:

- Gestión académica
- Comunicación entre padres, docentes y alumnos
- Inscripción de estudiantes
- Visualización de calificaciones

---

## 👥 User Roles

### 👨‍👩‍👧 Padres
- Ver información institucional
- Inscribir hijos
- Consultar calificaciones
- Leer noticias y comunicados

### 🎓 Alumnos
- Ver dashboard académico
- Consultar materias
- Ver calificaciones

### 👩‍🏫 Docentes
- Publicar noticias
- Cargar calificaciones
- Gestionar contenido académico

### 🛠️ Admin
- Gestión completa del sistema
- Usuarios, cursos, noticias, inscripciones

---

## 🌐 Public Pages

- `/` → Landing
- `/cursos` → Listado de cursos
- `/inscripciones` → Formulario de inscripción
- `/noticias` → Blog institucional
- `/noticias/[slug]` → Detalle de noticia

---

## 🔐 Private Area (`/dashboard`)

### Alumno
- Materias
- Calificaciones
- Promedio

### Padre
- Hijos registrados
- Calificaciones por hijo

### Docente
- Gestión de notas
- Publicación de noticias

### Admin
- CRUD completo (usuarios, cursos, noticias, inscripciones)

---

## 💳 Pagos (Futuro)

- Integración con Stripe o PayPal
- Pago de inscripciones y cuotas mensuales
- Historial de pagos por alumno (visible para padres y admin)
