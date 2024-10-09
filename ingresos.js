const express = require('express');
const router = express.Router();
const mysql = require('mysql');

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

router.post('/registrarIngreso', (req, res) => {
  const { producto, cantidad, descripcion, valor, formaDePago } = req.body;

  if (!producto || !cantidad || !valor || !formaDePago) {
    return res.status(400).json({ error: 'Faltan datos requeridos' });
  }

  const query = 'INSERT INTO ingresos (fecha, producto, cantidad, descripcion, valor, forma_de_pago) VALUES (?, ?, ?, ?, ?, ?)';
  const fecha = new Date(); 

  connection.query(query, [fecha, producto, cantidad, descripcion, valor, formaDePago], (err, result) => {
    if (err) {
      console.error('Error al registrar ingreso:', err);
      return res.status(500).json({ error: 'Error al registrar el ingreso' });
    }


    connection.query('UPDATE producto SET stock = stock - ? WHERE nombre = ?', [cantidad, producto], (err) => {
      if (err) {
        console.error('Error al reducir el stock:', err);
        return res.status(500).json({ error: 'Error al reducir el stock' });
      }
    });

    res.status(201).json({ message: 'Ingreso registrado correctamente', id_ingreso: result.insertId });
  });
});

router.get('/', (req, res) => {
  const sql = 'SELECT id_ingreso, fecha, producto, cantidad, valor, forma_de_pago, descripcion FROM ingresos';

  connection.query(sql, (error, results) => {
    if (error) {
      return res.status(500).send('Error al obtener los ingresos');
    }
    res.json(results);
  });
});

router.delete('/:id_ingreso', (req, res) => {
  const id_ingreso = req.params.id_ingreso;
  const sql = 'DELETE FROM ingresos WHERE id_ingreso = ?';

  connection.query(sql, [id_ingreso], (error, results) => {
    if (error) {
      return res.status(500).json({ error: 'Error al eliminar el registro de ingreso' });
    }
    res.json({ message: 'Registro eliminado correctamente' });
  });
});

router.put('/:id_ingreso', (req, res) => {
  const id_ingreso = req.params.id_ingreso;
  const { fecha, producto, cantidad, descripcion, valor, forma_de_pago } = req.body;

  const query = `
    UPDATE ingresos 
    SET fecha = ?, producto = ?, cantidad = ?, descripcion = ?, valor = ?, forma_de_pago = ? 
    WHERE id_ingreso = ?`;

  connection.query(query, [fecha, producto, cantidad, descripcion, valor, forma_de_pago, id_ingreso], (error, results) => {
    if (error) {
      console.error('Error en la consulta:', error);
      return res.status(500).json({ error: 'Error al actualizar el registro de ingreso' });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Ingreso no encontrado para actualizar' });
    }

    res.json({ message: 'Ingreso actualizado exitosamente' });
  });
});

router.get('/:id_ingreso', (req, res) => {
  const id_ingreso = req.params.id_ingreso;

  const query = 'SELECT * FROM ingresos WHERE id_ingreso = ?';
  connection.query(query, [id_ingreso], (error, results) => {
    if (error) {
      console.error('Error en la consulta:', error);
      return res.status(500).json({ error: 'Error al obtener el registro de ingreso' });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ error: 'Ingreso no encontrado' });
    }

    res.json(results[0]);
  });
});


router.put('/reducirStock', (req, res) => {
  const { producto, cantidad } = req.body;

  if (!producto || !cantidad) {
    return res.status(400).json({ error: 'Faltan datos requeridos para reducir el stock' });
  }

  const query = 'UPDATE producto SET stock = stock - ? WHERE nombre = ?'; 

  connection.query(query, [cantidad, producto], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Error al reducir el stock' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.status(200).json({ message: 'Stock reducido correctamente' });
  });
});

module.exports = router;
