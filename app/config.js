/*
* @Author: perry
* @Date:   2018-03-15 15:59:33
* @Last Modified by:   perry
* @Last Modified time: 2018-03-15 17:12:55
*/
// const CONF = {
//     port: '5757',
//     rootPathname: '',

//     // 微信小程序 App ID
//     appId: 'wx8276fe97311f08fc',

//     // 微信小程序 App Secret
//     appSecret: '217676207b5ad04146995dbdab6e4602',

//     // 是否使用腾讯云代理登录小程序
//     useQcloudLogin: false,

//     /**
//      * MySQL 配置，用来存储 session 和用户信息
//      * 若使用了腾讯云微信小程序解决方案
//      * 开发环境下，MySQL 的初始密码为您的微信小程序 appid
//      */
//     mysql: {
//         host: 'localhost',
//         port: 3306,
//         user: 'root',
//         db: 'test',
//         pass: 'root'
//     },

//     cos: {
//         /**
//          * 地区简称
//          * @查看 https://cloud.tencent.com/document/product/436/6224
//          */
//         region: 'ap-guangzhou',
//         // Bucket 名称
//         fileBucket: 'qcloudtest',
//         // 文件夹
//         uploadFolder: ''
//     },

//     // 微信登录态有效期
//     wxLoginExpires: 7200,
//     wxMessageToken: 'abcdefgh'
// }

// module.exports = CONF



const configs = {
  appId: 'wx8276fe97311f08fc',
  appSecret: '217676207b5ad04146995dbdab6e4602',
  useQcloudLogin: false,
  cos: {
    region: 'cn-south',
    fileBucket: 'test',
    uploadFolder: ''
  },
  serverHost: 'smallcode.chenqingpu.cn',
  tunnelServerUrl: '1234567.ws.qcloud.la',
  tunnelSignatureKey: 'abcdefghijkl',
  qcloudAppId: '121000000',
  qcloudSecretId: 'ABCDEFG',
  qcloudSecretKey: 'abcdefghijkl',
  wxMessageToken: 'abcdefghijkl'
}
const qcloud = require('qcloud-weapp-server-sdk')(configs)