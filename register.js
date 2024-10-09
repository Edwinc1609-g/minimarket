const express = require('express');
const mysql = require('mysql');
const router = express.Router();

router.post('/register', (req, res) => {
    const { user, email, password } = req.body;

    if (!user || !email || !password) {
        return res.status(400).json({ message: 'Todos los campos son necesarios' });
    }

    
    const sql = 'INSERT INTO cliente (cliente_id, correo, CI) VALUES (?, ?, ?)';
    const values = [user, email, password];

    db.query(sql, values, (err, results) => {
        if (err) {
            console.error('Error al registrar el usuario:', err);
            return res.status(500).json({ message: 'Error al registrar el usuario' });
        }

        res.status(200).json({ message: 'Usuario registrado exitosamente' });
    });
});

module.exports = router;
