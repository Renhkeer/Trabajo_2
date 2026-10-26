const express = require('express');
const cors = require('cors');
const { sql, poolPromise } = require('./db');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json({
    mensaje: 'API Tickets de Soporte funcionando con SQL Server'
  });
});

// Revisa que vengan todos los campos obligatorios del ticket
function faltanCampos(body) {
  const { asunto, solicitante, descripcion, categoria, prioridad, estado } = body;
  return !asunto || !solicitante || !descripcion || !categoria || !prioridad || !estado;
}

// GET /api/tickets - Obtener todos
app.get('/api/tickets', async (req, res) => {
  try {
    const pool = await poolPromise;
    const resultado = await pool.request().query('SELECT * FROM tickets ORDER BY id DESC');
    res.status(200).json(resultado.recordset);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al consultar los tickets' });
  }
});

// GET /api/tickets/:id - Obtener uno
app.get('/api/tickets/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ mensaje: 'ID inválido' });
  }

  try {
    const pool = await poolPromise;
    const resultado = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM tickets WHERE id = @id');

    if (resultado.recordset.length === 0) {
      return res.status(404).json({ mensaje: 'Ticket no encontrado' });
    }
    res.status(200).json(resultado.recordset[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al consultar el ticket' });
  }
});

// POST /api/tickets - Crear
app.post('/api/tickets', async (req, res) => {
  if (faltanCampos(req.body)) {
    return res.status(400).json({ mensaje: 'Complete todos los campos obligatorios' });
  }
  const { asunto, solicitante, descripcion, categoria, prioridad, estado } = req.body;

  try {
    const pool = await poolPromise;
    // La fechaRegistro la pone la base de datos con GETDATE()
    const resultado = await pool.request()
      .input('asunto', sql.NVarChar, asunto.trim())
      .input('solicitante', sql.NVarChar, solicitante.trim())
      .input('descripcion', sql.NVarChar, descripcion.trim())
      .input('categoria', sql.NVarChar, categoria)
      .input('prioridad', sql.NVarChar, prioridad)
      .input('estado', sql.NVarChar, estado)
      .query(`
        INSERT INTO tickets (asunto, solicitante, descripcion, categoria, prioridad, estado)
        OUTPUT INSERTED.*
        VALUES (@asunto, @solicitante, @descripcion, @categoria, @prioridad, @estado)
      `);

    res.status(201).json(resultado.recordset[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al registrar el ticket' });
  }
});

// PUT /api/tickets/:id - Actualizar
app.put('/api/tickets/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ mensaje: 'ID inválido' });
  }
  if (faltanCampos(req.body)) {
    return res.status(400).json({ mensaje: 'Complete todos los campos obligatorios' });
  }
  const { asunto, solicitante, descripcion, categoria, prioridad, estado } = req.body;

  try {
    const pool = await poolPromise;
    const resultado = await pool.request()
      .input('id', sql.Int, id)
      .input('asunto', sql.NVarChar, asunto.trim())
      .input('solicitante', sql.NVarChar, solicitante.trim())
      .input('descripcion', sql.NVarChar, descripcion.trim())
      .input('categoria', sql.NVarChar, categoria)
      .input('prioridad', sql.NVarChar, prioridad)
      .input('estado', sql.NVarChar, estado)
      .query(`
        UPDATE tickets
        SET asunto = @asunto, solicitante = @solicitante, descripcion = @descripcion,
            categoria = @categoria, prioridad = @prioridad, estado = @estado
        WHERE id = @id
      `);

    if (resultado.rowsAffected[0] === 0) {
      return res.status(404).json({ mensaje: 'Ticket no encontrado' });
    }
    res.status(200).json({ mensaje: 'Ticket actualizado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al actualizar el ticket' });
  }
});

// DELETE /api/tickets/:id - Eliminar
app.delete('/api/tickets/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ mensaje: 'ID inválido' });
  }

  try {
    const pool = await poolPromise;
    const resultado = await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM tickets WHERE id = @id');

    if (resultado.rowsAffected[0] === 0) {
      return res.status(404).json({ mensaje: 'Ticket no encontrado' });
    }
    res.status(200).json({ mensaje: 'Ticket eliminado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al eliminar el ticket' });
  }
});

app.listen(PORT, () => {
  console.log(`API ejecutándose en http://localhost:${PORT}`);
});
