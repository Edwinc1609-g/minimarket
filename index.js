const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const clienteRouter = require('./cliente');
const ingresosRouter = require('./ingresos');
const productoRouter = require('./producto');
const proveedorRouter = require('./proveedor');
const facturaRouter = require('./factura');
const detalleFacturaRouter = require('./detalle_factura');
const proveeRouter = require('./provee');
const registerRouter = require('./register');
const loginRouter = require('./login');
const gastosRouter = require('./gastos');
const buscarRouter = require('./buscar'); 


app.use('/producto', buscarRouter);
app.use('/gastos', gastosRouter);
app.use('/cliente', clienteRouter);
app.use('/api/ingresos', ingresosRouter);
app.use('/ingresos', ingresosRouter);
app.use('/producto', productoRouter);
app.use('/proveedor', proveedorRouter);
app.use('/factura', facturaRouter);
app.use('/detalle_factura', detalleFacturaRouter);
app.use('/provee', proveeRouter);
app.use('/api/register', registerRouter); 
app.use('/api/login', loginRouter); 

app.use(express.static('pagina_web'));
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/pagina_web/index.html');
});

app.use((req, res) => {
    res.status(404).send('No se encontró la ruta');
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
