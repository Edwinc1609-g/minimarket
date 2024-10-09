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

router.get('/:COD_PRODUCTO', (req, res) => {
  const codProducto = req.params.COD_PRODUCTO;
  connection.query('SELECT nombre, marca, color, stock, precio, COD_PRODUCTO FROM producto WHERE COD_PRODUCTO = ?', [codProducto], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.json(results[0]); 
  });
});


router.post('/:COD_PRODUCTO', (req, res) => {
  const codProducto = req.params.COD_PRODUCTO;
  connection.query('SELECT nombre, marca, color, stock, precio, COD_PRODUCTO FROM producto WHERE COD_PRODUCTO = ?', [codProducto], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.json(results[0]); 
  });
});


router.get('/', (req, res) => {
  connection.query('SELECT nombre, marca, color, stock, precio, COD_PRODUCTO FROM producto', (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});


router.post('/', (req, res) => {
  const { nombre, marca, color, stock, precio } = req.body;
  if (!nombre || !marca || !color || !stock || !precio) {
    return res.status(400).json({ message: "Todos los campos con (*) son obligatorios" });
  }

  const query = 'INSERT INTO producto (nombre, marca, color, stock, precio) VALUES (?, ?, ?, ?, ?)';
  connection.query(query, [nombre, marca, color, stock, precio], (error, results) => {
    if (error) {
      console.error('Error al agregar producto:', error);
      return res.status(500).json({ message: 'Error al agregar el producto' });
    }
    res.status(201).json({ message: 'Producto agregado exitosamente', productoId: results.insertId });
  });
  
});

router.delete('/:cod_producto', (req, res) => {
  const codProducto = req.params.cod_producto;
  connection.query('DELETE FROM producto WHERE COD_PRODUCTO = ?', [codProducto], (err, result) => {
    if (err) {
      res.status(500).send('Error al eliminar el producto');
    } else {
      res.sendStatus(200);
    }
  });
});


router.put('/:cod_producto', (req, res) => {
  const codProducto = req.params.cod_producto;
  const { nombre, marca, color, stock, precio } = req.body;
  connection.query(
    'UPDATE producto SET nombre = ?, marca = ?, color = ?, stock = ?, precio = ? WHERE COD_PRODUCTO = ?',
    [nombre, marca, color, stock, precio, codProducto],
    (err, result) => {
      if (err) {
        res.status(500).send('Error al actualizar el producto');
      } else {
        res.sendStatus(200);
      }
    }
  );
});


router.get('/buscar', (req, res) => {
  const terminoBusqueda = req.query.q; 

  const query = 'SELECT nombre, marca, color, stock, precio, COD_PRODUCTO FROM producto WHERE nombre LIKE ?';
  connection.query(query, [`%${terminoBusqueda}%`], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'No se encontraron productos que coincidan con la búsqueda' });
    }
    res.json(results);
  });
});


module.exports = router;