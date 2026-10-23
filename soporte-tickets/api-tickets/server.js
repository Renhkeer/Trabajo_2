const express = require('express');
const cors = require('cors');
const { sql, poolPromise } = require('./db');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json({
    mensaje: 'API Biblioteca funcionando con SQL Server'
  });
});

// GET /api/libros - Obtener todos
app.get('/api/libros', async (req, res) => {
  try {
    const pool = await poolPromise;
    const resultado = await pool.request().query('SELECT * FROM libros ORDER BY id DESC');
    res.status(200).json(resultado.recordset);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al consultar los libros' });
  }
});

// GET /api/libros/:id - Obtener uno
app.get('/api/libros/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ mensaje: 'ID inválido' });
  }

  try {
    const pool = await poolPromise;
    const resultado = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM libros WHERE id = @id');

    if (resultado.recordset.length === 0) {
      return res.status(404).json({ mensaje: 'Libro no encontrado' });
    }
    res.status(200).json(resultado.recordset[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al consultar el libro' });
  }
});

// POST /api/libros - Crear
app.post('/api/libros', async (req, res) => {
  const { titulo, autor, categoria, anio, disponible, editorial } = req.body;
  
  if (!titulo || !autor || !categoria || !anio || !editorial) {
    return res.status(400).json({ mensaje: 'Complete todos los campos obligatorios' });
  }

  try {
    const pool = await poolPromise;
    const resultado = await pool.request()
      .input('titulo', sql.VarChar, titulo.trim())
      .input('autor', sql.VarChar, autor.trim())
      .input('categoria', sql.VarChar, categoria.trim())
      .input('editorial', sql.VarChar, editorial.trim())
      .input('anio', sql.Int, Number(anio))
      .input('disponible', sql.Bit, disponible ?? true)
      .query(`
        INSERT INTO libros (titulo, autor, categoria, anio, disponible, editorial)
        OUTPUT INSERTED.id
        VALUES (@titulo, @autor, @categoria, @anio, @disponible, @editorial)
      `);
      
    res.status(201).json({
      id: resultado.recordset[0].id,
      titulo: titulo.trim(),
      autor: autor.trim(),
      categoria: categoria.trim(),
      anio: Number(anio),
      disponible: disponible ?? true,
      editorial: editorial.trim()
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al registrar el libro' });
  }
});

// PUT /api/libros/:id - Actualizar
app.put('/api/libros/:id', async (req, res) => {
  const id = Number(req.params.id);
  const { titulo, autor, categoria, anio, disponible, editorial } = req.body;

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ mensaje: 'ID inválido' });
  }
  if (!titulo || !autor || !categoria || !anio || !editorial) {
    return res.status(400).json({ mensaje: 'Complete todos los campos obligatorios' });
  }

  try {
    const pool = await poolPromise;
    const resultado = await pool.request()
      .input('id', sql.Int, id)
      .input('titulo', sql.VarChar, titulo.trim())
      .input('autor', sql.VarChar, autor.trim())
      .input('categoria', sql.VarChar, categoria.trim())
      .input('editorial', sql.VarChar, editorial.trim())
      .input('anio', sql.Int, Number(anio))
      .input('disponible', sql.Bit, disponible)
      .query(`
        UPDATE libros 
        SET titulo = @titulo, autor = @autor, categoria = @categoria, 
            anio = @anio, disponible = @disponible, editorial = @editorial
        WHERE id = @id
      `);

    if (resultado.rowsAffected[0] === 0) {
      return res.status(404).json({ mensaje: 'Libro no encontrado' });
    }
    res.status(200).json({ mensaje: 'Libro actualizado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al actualizar el libro' });
  }
});

// DELETE /api/libros/:id - Eliminar
app.delete('/api/libros/:id', async (req, res) => {
  const id = Number(req.params.id);
  
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ mensaje: 'ID inválido' });
  }

  try {
    const pool = await poolPromise;
    const resultado = await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM libros WHERE id = @id');

    if (resultado.rowsAffected[0] === 0) {
      return res.status(404).json({ mensaje: 'Libro no encontrado' });
    }
    res.status(200).json({ mensaje: 'Libro eliminado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al eliminar el libro' });
  }
});

app.listen(PORT, () => {
  console.log(`API ejecutándose en http://localhost:${PORT}`);
});