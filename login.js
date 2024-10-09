const express = require('express');
const router = express.Router();
const mysql = require('mysql');


router.post('/login', (req, res) => {
  const { user, password } = req.body;
  const query = 'SELECT * FROM cliente WHERE (cliente_id = ? OR Correo = ?) AND CI = ?';
  db.query(query, [user, user, password], (err, results) => {
    if (err) {
      console.error('Error al iniciar sesión:', err);
      res.status(500).json({ success: false, message: 'Error al iniciar sesión' });
    } else if (results.length > 0) {
      res.status(200).json({ success: true, message: 'Inicio de sesión exitoso' });
    } else {
      res.status(401).json({ success: false, message: 'Usuario y/o contraseña incorrectos' });
    }
  });
});

module.exports = router;
