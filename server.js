const express = require('express');
const cors = require('cors');
const conection = require('./database');


const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.get('/')