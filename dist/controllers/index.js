'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
/*
* @Author: perry
* @Date:   2018-03-14 10:22:24
* @Last Modified by:   perry
* @Last Modified time: 2018-04-13 17:58:26
*/

class Controller {
  constructor() {
    this.getDataFromReq = this.getDataFromReq.bind(this);
  }

  getDataFromReq(req) {
    const data = req.method === 'GET' || req.method === 'DELETE' ? req.query : req.body;
    return data;
  }
}
exports.default = Controller;
