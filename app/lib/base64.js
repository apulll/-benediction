/*
* @Author: perry
* @Date:   2018-04-02 14:30:53
* @Last Modified by:   perry
* @Last Modified time: 2018-04-02 14:33:29
*/

const base64 = {
	encode: function(string) {
		const b = new Buffer(string);
		const s = b.toString('base64');
		return s;
	},
	decode: function(code) {
		var b = new Buffer(code, 'hex');
		var s = b.toString('utf8');
		return s;
	}
};

export default base64;
