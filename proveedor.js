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

router.get('/', (req, res) => {
    const sql = 'SELECT id_proveedor, nombre, direccion, telefono, correo FROM proveedor';

    connection.query(sql, (error, results) => {
        if (error) {
            return res.status(500).send('Error al obtener los proveedores');
        }
        res.json(results);
    });
});

router.post('/', (req, res) => {
    const { id_proveedor, nombre, direccion, telefono, correo } = req.body;

    if (!id_proveedor || !nombre || !direccion || !telefono || !correo) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }
    const sql = 'INSERT INTO proveedor (id_proveedor, nombre, direccion, telefono, correo) VALUES (?, ?, ?, ?, ?)';
    connection.query(sql, [id_proveedor, nombre, direccion, telefono, correo], (error, results) => {
        if (error) {
            return res.status(500).json({ message: 'Error al agregar el proveedor', error: error.message });
        }
        res.status(201).json({ message: 'Proveedor agregado correctamente', id: results.insertId });
    });
});



router.put('/:id', (req, res) => {
    const id = req.params.id;
    const {id_proveedor, nombre, direccion, telefono, correo } = req.body;
    const sql = 'UPDATE proveedor SET id_proveedor = ?, nombre = ?, direccion = ?, telefono = ?, correo = ? WHERE id_proveedor = ?';

    connection.query(sql, [id_proveedor, nombre, direccion, telefono, correo,], (error, results) => {
        if (error) {
            return res.status(500).send('Error al actualizar el proveedor');
        }
        res.send('Proveedor actualizado correctamente');
    });
});

router.delete('/:id', (req, res) => {
    const id = req.params.id;
    const sql = 'DELETE FROM proveedor WHERE id_proveedor = ?';

    connection.query(sql, [id], (error, results) => {
        if (error) {
            return res.status(500).send('Error al eliminar el proveedor');
        }
        res.send('Proveedor eliminado correctamente');
    });
});

module.exports = router;

