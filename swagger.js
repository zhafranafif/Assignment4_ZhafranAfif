const swaggerAutogen = require('swagger-autogen');

const outputFile = './swagger_output.json';
const endpointsFiles = ['./server/api/laptop.js'];

swaggerAutogen(outputFile, endpointsFiles);
