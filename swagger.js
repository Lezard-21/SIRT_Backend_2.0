const swaggerAutogen = require('swagger-autogen')();
const doc = {
    info: {
        // name of your api
        title: 'Backend Node.js API',
        description: 'Esta es una API en node js para un sistema de reporte de tutorias'
    },
    host: 'localhost:4000'
};
// Se generará un nuevo archivo con la documentación
const outputFile = './swagger-output.json';
const routes = ['./src/app.js'];
// Se general la documentación
swaggerAutogen(outputFile, routes, doc);