/*
* @Author: perry
* @Date:   2018-05-01 22:14:55
* @Last Modified by:   perry
* @Last Modified time: 2018-05-01 22:37:58
*/
const nodemailer = require('nodemailer');
const Logger = require('./logger')('lib/mail');
exports.sendMail = function(xlsxname) {
  const transporter = nodemailer.createTransport({
    host: 'smtp.qq.com',
    secureConnection: true, // use SSL
    port: 465,
    secure: true, // secure:true for port 465, secure:false for port 587
    auth: {
      user: '1216065136@qq.com',
      pass: 'hnnicpoiprrxiafi'
    }
  });
  const mailOptions = {
    from: '1216065136@qq.com',
    to: `884201733@qq.com`,
    subject: '老板,您要的excel来了,格式您自己处理下!',
    html: `<h2>我发誓,我是手动导出的</h2>`
  };
  return new Promise(function(resolve, reject) {
    transporter.sendMail(mailOptions, function(error, info) {
      if (error) {
        Logger.error(error);
        reject(error);
      } else {
        Logger.info(info);
        resolve(info);
      }
    });
  });
};
