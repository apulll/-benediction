/*
* @Author: perry
* @Date:   2018-03-14 09:38:05
* @Last Modified by:   perry
* @Last Modified time: 2018-04-03 14:50:28
*/
import express from 'express';
import http from 'http';
import path from 'path';
import bodyParser from 'body-parser';
import db from './db/core';
import router from './routes';
const helmet = require('helmet');

const app = express();
const isProduction = process.env.NODE_ENV === 'production';
const port = isProduction ? process.env.PORT || 6554 : process.env.PORT || 6554;

const publicPath = path.resolve(__dirname, '../public/');
app.use(helmet());
app.use(express.static(publicPath));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/api', router);

const server = http.createServer(app);
server.listen(port);

console.log('server listening on:', port);
