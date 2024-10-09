app.post('/factura', async (req, res) => {
    const { fecha_emision, cliente_id, total, forma_pago, descripcion, detalle } = req.body;

    try {
        const result = await db.query('INSERT INTO factura (fecha_emision, cliente_id, total) VALUES (?, ?, ?)', [fecha_emision, cliente_id, total]);
        const facturaId = result.insertId;

        for (const item of detalle) {
            await db.query('INSERT INTO detalle_factura (factura_id, producto_id, cantidad, precio_unitario, subtotal) VALUES (?, ?, ?, ?, ?)', [facturaId, item.producto_id, item.cantidad, item.precioUnitario, item.subtotal]);
        }

        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: 'Error al registrar la venta.' });
    }
});
