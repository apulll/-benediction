/*
* @Author: perry
* @Date:   2018-03-14 10:57:49
* @Last Modified by:   perry
* @Last Modified time: 2018-03-14 18:23:12
*/
exports.jsonFormatter = function(response, err = false, code = 200) {
	return {
        res: response.res || {},
        msg: response.msg || '成功！',
        errors: response.errors || [],
        status: !err,
        code
    }
}

exports.getDataFromReq = function(req) {
	const data  = (req.method === 'GET' || req.method === 'DELETE')  ? req.query : req.body
	return data
}