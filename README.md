# Sistema de Gestión de Tickets de Soporte

Aplicación web full stack para registrar, consultar, editar y eliminar tickets de soporte técnico. Reemplaza el registro manual de solicitudes (mensajes y planillas) por una aplicación con base de datos, así los datos no se pierden al cerrar o reiniciar la aplicación.

## Autor

Benjamin Canahuate

## Tecnologías utilizadas

- **Frontend:** Angular 22 (componentes standalone, routing, HttpClient, formularios reactivos)
- **Backend:** Node.js con Express 5 y CORS
- **Base de datos:** SQL Server Express (`localhost\SQLEXPRESS`), conectado con `mssql` y `msnodesqlv8` usando autenticación de Windows
- **Pruebas:** Vitest (tests unitarios por defecto de Angular)

Elegí SQL Server en vez de MySQL porque ya lo tenía instalado y configurado desde la Actividad 06. Es una base de datos relacional equivalente, que la guía permite.

## Estructura del proyecto

```
soporte-tickets/
├── base-datos.sql          Script que crea la base tickets_db, la tabla tickets y datos de ejemplo
├── api-tickets/            Backend (API REST)
│   ├── db.js               Conexión a SQL Server
│   └── server.js           Endpoints /api/tickets (GET, POST, PUT, DELETE)
└── tickets-angular/        Frontend
    └── src/app/
        ├── models/ticket.ts            Interfaz Ticket y listas de categorías, prioridades y estados
        ├── services/tickets.ts         Servicio que centraliza las llamadas HTTP a la API
        ├── components/
        │   ├── cabecera/               Encabezado de la página
        │   ├── menu/                   Menú de navegación
        │   ├── inicio/                 Página de inicio
        │   ├── tickets/                Listado de tickets con etiquetas de color
        │   ├── nuevo-ticket/           Formulario para registrar
        │   └── editar-ticket/          Formulario para editar
        └── app.routes.ts               Rutas de la aplicación
```

### Endpoints de la API

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/tickets` | Lista todos los tickets (del más nuevo al más antiguo) |
| GET | `/api/tickets/:id` | Obtiene un ticket |
| POST | `/api/tickets` | Crea un ticket y lo devuelve con su `id` y `fechaRegistro` |
| PUT | `/api/tickets/:id` | Actualiza un ticket |
| DELETE | `/api/tickets/:id` | Elimina un ticket |

Todas las consultas son parametrizadas (`.input()` de `mssql`), así los datos del usuario nunca se concatenan en el SQL. La API responde 400 si faltan campos o el id no es válido, 404 si el ticket no existe y 500 si falla la base de datos.

## Instalación

Requisitos: Node.js (probado con v26), Angular CLI 22 y SQL Server Express con la instancia `SQLEXPRESS`.

1. Clonar el repositorio:
   ```
   git clone https://github.com/Renhkeer/Trabajo_2.git
   cd Trabajo_2/soporte-tickets
   ```
2. Crear la base de datos: abrir `base-datos.sql` en SQL Server Management Studio y ejecutarlo, o desde la consola:
   ```
   sqlcmd -S localhost\SQLEXPRESS -E -f 65001 -i base-datos.sql
   ```
   El script se puede ejecutar varias veces, porque solo crea lo que no existe.
3. Instalar dependencias:
   ```
   cd api-tickets
   npm install
   cd ../tickets-angular
   npm install
   ```

## Ejecución

Se necesitan dos consolas:

1. **API** (queda en http://localhost:3000):
   ```
   cd soporte-tickets/api-tickets
   node server.js
   ```
   Debe mostrar `Conectado a SQL Server (Autenticación de Windows)`.
2. **Frontend** (queda en http://localhost:4200):
   ```
   cd soporte-tickets/tickets-angular
   npm start
   ```

Para correr los tests unitarios: `npx ng test --watch=false` dentro de `tickets-angular`.

## Funcionalidades implementadas

- Listado de tickets obtenidos desde la base de datos, en tarjetas.
- Etiquetas de color según el estado (Abierto / En proceso / Cerrado) y la prioridad (Baja / Media / Alta).
- Registro de tickets con un formulario. Categoría, prioridad y estado se eligen de listas fijas.
- Edición de un ticket existente. El formulario se carga con los datos guardados.
- Eliminación con confirmación previa.
- Validaciones en los formularios: campos obligatorios y largo mínimo y máximo. No se puede enviar un formulario inválido.
- La fecha de registro la asigna la base de datos (`DEFAULT GETDATE()`).
- Mensajes de error en la interfaz cuando la API no responde o falla una operación, con botón para reintentar la carga del listado.
- Persistencia real en SQL Server: los datos se mantienen al recargar Angular y al reiniciar la API.

## Pruebas realizadas

### Tests unitarios (Vitest)

Los tests que crea Angular por defecto fallaban porque los componentes que usan el router no lo tenían configurado en el test, y porque el test del título buscaba el texto antiguo "Hello, biblioteca-angular". Agregué `provideRouter([])` y cambié el texto esperado a "Soporte Técnico". Resultado: **8 archivos y 9 tests aprobados**. `ng build` también compila sin errores.

### Pruebas de la API (con curl)

| Prueba | Resultado |
|--------|-----------|
| `GET /` | Responde el mensaje de la API |
| `POST` con campos faltantes | 400 "Complete todos los campos obligatorios" |
| `GET /api/tickets/abc` | 400 "ID inválido" |
| `GET /api/tickets/1` | Devuelve el ticket de ejemplo, con tildes correctas |
| `POST` con todos los campos | 201, devuelve el ticket con `id` y `fechaRegistro` |
| `PUT` del ticket creado | "Ticket actualizado correctamente", y el `GET` posterior muestra los cambios |
| `DELETE` del ticket creado | "Ticket eliminado correctamente", y el `GET` posterior responde 404 |
| Reiniciar la API | Los tickets siguen en la base de datos |

### Pruebas mínimas desde la interfaz

| Prueba | Resultado esperado | Resultado |
|--------|--------------------|-----------|
| Inicio | Frontend, API y BD se ejecutan siguiendo este README
| GET | La interfaz muestra los tickets guardados
| POST | Un ticket creado desde Angular aparece en la base de datos
| PUT | Una modificación desde Angular permanece al recargar
| DELETE | Un ticket eliminado desaparece de la interfaz y de la BD
| Validación | El formulario impide enviar datos obligatorios vacíos o inválidos
| Error | Con la API apagada, la interfaz muestra un mensaje de error
| Persistencia | Los registros permanecen después de reiniciar la API

## Declaración de uso de Inteligencia Artificial

**Herramienta utilizada:** Claude Code (asistente de programación de Anthropic, modelo Claude), usado desde la terminal dentro del repositorio.

**Actividades en las que se usó:**
- **Estructura inicial:** renombrar el proyecto de la Actividad 06 (biblioteca) a tickets, quitar SSR y cambiar textos.
- **Frontend:** generar el modelo `Ticket`, el servicio `TicketsService`, las rutas, el listado con etiquetas de color y los formularios con validaciones.
- **Backend:** adaptar los endpoints de la API de libros a `/api/tickets`, manteniendo la misma estructura.
- **Base de datos (ajuste a SQL Server):** la guía de la actividad está pensada para MySQL y yo usé SQL Server. La IA me ayudó a ajustar la base de datos a SQL Server: escribir el script `base-datos.sql` con tipos y funciones de SQL Server (`IDENTITY`, `NVARCHAR`, `DEFAULT GETDATE()`, restricciones `CHECK`, `OUTPUT INSERTED.*`), apuntar la conexión de `db.js` a la base `tickets_db` con autenticación de Windows, y probar el CRUD completo contra la base.
- **Pruebas y documentación:** diagnosticar y corregir los tests unitarios que fallaban, y redactar este README.

**Decisiones y trabajo propio:**
- Definí el caso y las decisiones del proyecto: usar SQL Server con autenticación de Windows, sin SSR, mostrar los tickets en tarjetas con etiquetas de color, usar listas fijas de categoría, prioridad y estado, que la fecha la ponga la base de datos y que la API valide los campos obligatorios.
- Partí del proyecto de la Actividad 06 (API Express y conexión `db.js`), que sirvió de base para el backend.
- Trabajé por etapas: revisé cada etapa antes de pasar a la siguiente y la subí en su propio commit.
- Revisé y ajusté el código generado, por ejemplo los comentarios del script SQL.
- Ejecuté la aplicación y las pruebas descritas arriba para comprobar que funciona.

Puedo explicar cada parte del código entregado: componentes, servicio, rutas, validaciones, endpoints y consultas.
