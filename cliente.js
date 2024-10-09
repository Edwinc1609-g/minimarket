const express = require('express');
const router = express.Router();
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123456789',
  database: 'minimarket'
});

connection.connect((err) => {
  if (err) {
    console.error('Error conectando a la base de datos: ', err);
    return;
  }
  console.log('Conexión a la base de datos establecida');
});

router.get('/:CI', (req, res) => {
  const ci = req.params.CI;
  connection.query('SELECT CI, cliente_id, APELLIDO, DIRECCION, TELEFONO, Correo FROM cliente WHERE CI = ?', [ci], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }
    res.json(results[0]); 
  });
});


router.post('/:CI', (req, res) => {
  const ci = req.params.CI;
  connection.query('SELECT CI, cliente_id, APELLIDO, DIRECCION, TELEFONO, Correo FROM cliente WHERE CI = ?', [ci], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }
    res.json(results[0]); 
  });
});

router.get('/', (req, res) => {
  connection.query('SELECT CI, cliente_id, APELLIDO, DIRECCION, TELEFONO, Correo FROM cliente', (err, results) => {
    if (err) {t
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});


router.post('/', (req, res) => {
  const { CI, cliente_id ,APELLIDO ,DIRECCION, TELEFONO, Correo } = req.body;
  if (!CI || !cliente_id || !APELLIDO || !DIRECCION || !TELEFONO || !Correo) {
    return res.status(400).json({ message: "Todos los campos con (*) son obligatorios" });
  }

  const query = 'INSERT INTO cliente (CI, cliente_id, APELLIDO, DIRECCION, TELEFONO, Correo) VALUES (?, ?, ?, ?, ?, ?)';
  connection.query(query, [CI, cliente_id, APELLIDO, DIRECCION, TELEFONO, Correo], (error, results) => {
    if (error) {
      console.error('Error al agregar Cliente:', error);
      return res.status(500).json({ message: 'Error al agregar el Cliente' });
    }
    res.status(201).json({ message: 'Cliente agregado exitosamente', clienteId: results.insertId });
  });
});

router.delete('/:CI', (req, res) => {
  const ciCliente = req.params.CI;
  connection.query('DELETE FROM cliente WHERE CI = ?', [ciCliente], (err, result) => {
    if (err) {
      res.status(500).send('Error al eliminar al Cliente');
    } else {
      res.sendStatus(200);
    }
  });
});


router.put('/:CI', (req, res) => {
  const ci = req.params.CI;
  const { cliente_id, APELLIDO, DIRECCION, TELEFONO, Correo } = req.body;

  const query = 'UPDATE cliente SET cliente_id = ?, APELLIDO = ?, DIRECCION = ?, TELEFONO = ?, Correo = ? WHERE CI = ?';
  connection.query(query, [cliente_id, APELLIDO, DIRECCION, TELEFONO, Correo, ci], (error, results) => {
    if (error) {
      console.error('Error al actualizar cliente:', error);
      return res.status(500).json({ error: 'Error al actualizar cliente' });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }
    res.json({ message: 'Cliente actualizado correctamente' });
  });
});


module.exports = router;