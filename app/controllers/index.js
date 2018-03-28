/*
* @Author: perry
* @Date:   2018-03-14 10:22:24
* @Last Modified by:   perry
* @Last Modified time: 2018-03-28 22:38:49
*/

export default class Controller {
	constructor() {
		this.getDataFromReq = this.getDataFromReq.bind(this);
	}

	getDataFromReq(req) {
		const data =
			req.method === "GET" || req.method === "DELETE"
				? req.query
				: req.body;
		return data;
	}
}
