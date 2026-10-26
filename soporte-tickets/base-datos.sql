-- Script de la base de datos del Sistema de Tickets de Soporte
-- Ejecutar en SQL Server (localhost\SQLEXPRESS), por ejemplo desde SSMS
-- Se puede ejecutar varias veces: solo crea lo que no existe

IF DB_ID('tickets_db') IS NULL
    CREATE DATABASE tickets_db;
GO

USE tickets_db;
GO

IF OBJECT_ID('tickets') IS NULL
BEGIN
    CREATE TABLE tickets (
        id INT IDENTITY(1,1) PRIMARY KEY,
        asunto NVARCHAR(100) NOT NULL,
        solicitante NVARCHAR(100) NOT NULL,
        descripcion NVARCHAR(500) NOT NULL,
        categoria NVARCHAR(20) NOT NULL CHECK (categoria IN ('Hardware', 'Software', 'Red', 'Cuentas')),
        prioridad NVARCHAR(10) NOT NULL CHECK (prioridad IN ('Baja', 'Media', 'Alta')),
        estado NVARCHAR(20) NOT NULL DEFAULT 'Abierto' CHECK (estado IN ('Abierto', 'En proceso', 'Cerrado')),
        fechaRegistro DATETIME NOT NULL DEFAULT GETDATE()
    );

    -- Datos de ejemplo para probar la aplicación
    INSERT INTO tickets (asunto, solicitante, descripcion, categoria, prioridad, estado) VALUES
    ('Impresora no imprime', 'María González', 'La impresora del segundo piso muestra error de papel atascado.', 'Hardware', 'Media', 'Abierto'),
    ('No puedo entrar al correo', 'Pedro Soto', 'Al iniciar sesión dice que la contraseña está vencida.', 'Cuentas', 'Alta', 'En proceso'),
    ('Internet lento', 'Ana Rojas', 'La conexión Wi-Fi de la sala de reuniones se corta seguido.', 'Red', 'Baja', 'Cerrado');
END
GO

SELECT * FROM tickets;
