const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');

const dotenv = require("dotenv")
const app = express();
// Swagger
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('../swagger-output.json')


//Intermediarios
dotenv.config()
app.use(cors({
  origin: '*',//configurar los origenes cuando se tenga el frontend
  allowedHeaders:"*"
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(bodyParser.json());
// Swagger
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerFile))

//Enrutamiento de la API
//a//pp.use(require('./routes/AutenticacionWS'));
app.use(require('./routes/Cuentas.routes'));
app.use(require('./routes/Tutorias.routes'));
app.use(require('./routes/ExperienciasEducativas.routes'));
app.use(require('./routes/Docentes.routes'));
app.use(require('./routes/RelacionDocentesEE.routes'));
app.use(require('./routes/Reportes.routes'));
app.use(require('./routes/Problemas.routes'));
app.use(require('./routes/ProgramasEducativos.routes'));
app.use(require('./routes/Periodos.routes'));
app.use(require('./routes/auth.routes'));
app.use('*',(req, res)=>{res.status(404).send() })

// Middleware para el manejo de errores (Debe ser el último middleware a utilizar)
const errorhandler = require('./middlewares/errorhandler.middleware')
const errorlogger = require('./middlewares/errorLogger.middleware')
app.use(errorlogger, errorhandler)

module.exports = app;