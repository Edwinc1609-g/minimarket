const express = require('express');
const router = express.Router();
const mysql = require('mysql2');

router.get('/', (req, res) => {
  const sql = 'SELECT * FROM detalle_factura';
  db.query(sql, (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

router.post('/', (req, res) => {
  const newProduct = req.body;

  if (!Object.keys(newProduct).length) {
    return res.status(400).json({ error: 'No se proporcionaron datos para insertar' });
  }

  const sql = 'INSERT INTO detalle_factura SET ?';
  db.query(sql, newProduct, (err, result) => {
    if (err) {
      console.error('Error al insertar:', err);
      return res.status(500).json({ error: 'Error al insertar' });
    }
    res.status(201).json(result);
  });
});

router.put('/:id', (req, res) => {
  const sql = 'UPDATE detalle_factura SET ? WHERE id = ?';
  const id = req.params.id;
  const updateData = req.body;
  db.query(sql, [updateData, id], (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

router.delete('/:id', (req, res) => {
  const sql = 'DELETE FROM detalle_factura WHERE id = ?';
  const id = req.params.id;
  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

module.exports = router; 
