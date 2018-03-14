/*
* @Author: perry
* @Date:   2018-03-14 09:38:05
* @Last Modified by:   perry
* @Last Modified time: 2018-03-14 16:44:06
*/
import express from 'express';
import http from 'http';
import path from 'path';
import bodyParser from 'body-parser';
import swaggerJSDoc from 'swagger-jsdoc';
import db from './db/core';
import router from './routes';

const app = express();
const isProduction = process.env.NODE_ENV === 'production';
const port = isProduction ? (process.env.PORT || 6554) : (process.env.PORT || 6554);

const publicPath = path.resolve(__dirname, '../public/');
app.use(express.static(publicPath));
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());


const origin = `192.168.1.113:${port}`;
// swagger definition
var swaggerDefinition = {
  info: {
    title: 'Node Swagger API',
    version: '2.0.0',
    description: 'Demonstrating how to desribe a RESTful API with Swagger',
  },
  host: process.env.SWAGGER === 'online' ? 'xxxxx' : origin,
  basePath: '/',
};

// options for the swagger docs
var options = {
  // import swaggerDefinitions
  swaggerDefinition: swaggerDefinition,
  // path to the API docs
  apis: ['app/definitions/**/*.js','app/routes/**/*.js'],
};

// initialize swagger-jsdoc
var swaggerSpec = swaggerJSDoc(options);



app.use('/api', router);

app.get('/swagger.json', function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
})

const server = http.createServer(app);
server.listen(port);

console.log('server listening on:', port);