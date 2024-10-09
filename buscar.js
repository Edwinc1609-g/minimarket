const express = require('express');
const router = express.Router();
const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456789',
    database: 'minimarket'
});

router.get('/buscar', (req, res) => {
    const { nombre } = req.query;
    let query = 'SELECT * FROM producto WHERE nombre LIKE ?';
    const values = [`%${nombre}%`];

    connection.query(query, values, (err, results) => {
        if (err) {
            console.error('Error al buscar productos:', err);
            return res.status(500).json({ error: 'Error al buscar productos' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'No se encontraron productos' });
        }
        res.json(results);
    });
});

router.post('/aumentar-stock', (req, res) => {
    const { nombre, cantidad } = req.body;

    if (!nombre || !cantidad) {
        return res.status(400).json({ message: 'Nombre y cantidad son requeridos.' });
    }
    const sql = 'UPDATE producto SET STOCK = STOCK + ? WHERE NOMBRE = ?';
    connection.query(sql, [cantidad, nombre], (error, results) => {
        if (error) {
            console.error('Error al actualizar el stock:', error);
            return res.status(500).json({ message: 'Error al actualizar el stock.' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Producto no encontrado.' });
        }
        const getNewStockSql = 'SELECT STOCK FROM producto WHERE NOMBRE = ?';
        connection.query(getNewStockSql, [nombre], (err, stockResults) => {
            if (err) {
                console.error('Error al obtener el nuevo stock:', err);
                return res.status(500).json({ message: 'Error al obtener el nuevo stock.' });
            }
            const nuevoStock = stockResults[0].STOCK; 
            res.json({ message: 'Stock aumentado exitosamente.', nuevoStock });
        });
    });
});


module.exports = router;
