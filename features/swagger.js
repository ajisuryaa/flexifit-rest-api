const swaggerRoute = require('express').Router();
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const { apiPath } = require("../tools/api_path");

const options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Event API',
        version: '1.0.0'
      }
    },
    apis: [
      'features/accounts/route.js',
      // 'features/authentications/route.js',
      // 'features/dashboards/route.js',
      // 'features/registrations/route.js',
      // 'features/users/route.js',
      // 'features/qr_codes/route.js'
    ]
};

const swaggerSpec = swaggerJsdoc(options);
swaggerRoute.use(
    apiPath(process.env.API_VERSION, 'docs'), 
    swaggerUi.serve, 
    swaggerUi.setup(swaggerSpec)
);

module.exports = swaggerRoute;