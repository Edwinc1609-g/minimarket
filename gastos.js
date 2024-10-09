const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise'); 


const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '123456789',
  database: 'minimarket'
});

router.get('/', async (req, res) => {
  try {
    const [results] = await pool.query('SELECT * FROM gastos');
    res.json(results);
  } catch (err) {
    console.error('Error al obtener los gastos:', err);
    return res.status(500).json({ error: 'Error al obtener los gastos' });
  }
});

router.get('/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const [results] = await pool.query('SELECT * FROM gastos WHERE id = ?', [id]);
    if (results.length === 0) {
      return res.status(404).json({ message: 'Gasto no encontrado' });
    }
    res.json(results[0]);
  } catch (err) {
    console.error('Error al obtener el gasto:', err);
    return res.status(500).json({ error: 'Error al obtener el gasto' });
  }
});

router.post('/', async (req, res) => {
  const { fecha, producto, cantidad, valor, forma_pago, descripcion } = req.body;

  if (!fecha || !producto || !cantidad || !valor || !forma_pago || !descripcion) {
    return res.status(400).json({ message: 'Todos los campos con (*) son obligatorios' });
  }

  const query = 'INSERT INTO gastos (fecha, producto, cantidad, valor, forma_pago, descripcion) VALUES (?, ?, ?, ?, ?, ?)';
  const values = [fecha, producto, cantidad, valor, forma_pago, descripcion];

  try {
    const [results] = await pool.query(query, values);
    res.status(201).json({ message: 'Gasto agregado exitosamente', id: results.insertId });
  } catch (err) {
    console.error('Error al agregar el gasto:', err);
    return res.status(500).json({ error: 'Error al agregar el gasto' });
  }
});


router.put('/:id', async (req, res) => {
  const id = req.params.id;
  const { fecha, producto, cantidad, valor, forma_pago, descripcion } = req.body;

  if (!fecha || !producto || !cantidad || !valor || !forma_pago || !descripcion) {
    return res.status(400).json({ message: 'Todos los campos con (*) son obligatorios' });
  }

  const query = 'UPDATE gastos SET fecha = ?, producto = ?, cantidad = ?, valor = ?, forma_pago = ?, descripcion = ? WHERE id = ?';
  const values = [fecha, producto, cantidad, valor, forma_pago, descripcion, id];

  try {
    const [results] = await pool.query(query, values);
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Gasto no encontrado' });
    }
    res.json({ message: 'Gasto actualizado correctamente' });
  } catch (err) {
    console.error('Error al actualizar el gasto:', err);
    return res.status(500).json({ error: 'Error al actualizar el gasto' });
  }
});

router.delete('/:id', async (req, res) => {
  const id = req.params.id;
  const query = 'DELETE FROM gastos WHERE id = ?';

  try {
    const [results] = await pool.query(query, [id]);
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Gasto no encontrado' });
    }
    res.json({ message: 'Gasto eliminado correctamente' });
  } catch (err) {
    console.error('Error al eliminar el gasto:', err);
    return res.status(500).json({ error: 'Error al eliminar el gasto' });
  }
});

module.exports = router;
