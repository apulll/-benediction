'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _user = require('../controllers/user.ctr');

var _user2 = _interopRequireDefault(_user);

var _benison = require('../controllers/benison.ctr');

var _benison2 = _interopRequireDefault(_benison);

var _template = require('../controllers/template.ctr');

var _template2 = _interopRequireDefault(_template);

var _catalog = require('../controllers/catalog.ctr');

var _catalog2 = _interopRequireDefault(_catalog);

var _common = require('../controllers/common.ctr');

var _common2 = _interopRequireDefault(_common);

var _user_benison = require('../controllers/user_benison.ctr');

var _user_benison2 = _interopRequireDefault(_user_benison);

var _upload = require('../lib/upload');

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

const {
  check,
  validationResult
} = require('express-validator/check'); /*
                                                                        * @Author: perry
                                                                        * @Date:   2018-03-14 10:27:32
                                                                        * @Last Modified by:   perry
                                                                        * @Last Modified time: 2018-04-19 17:52:18
                                                                        */

// const { auth: { authorizationMiddleware, validationMiddleware } } = require('../qcloud')

const router = _express2.default.Router();

// --- 登录与授权 Demo --- //
// 登录接口
router.get(
  '/openid',
  [
    check('code', '不能为空')
      .exists()
      .custom((value, { req }) => (value ? true : false)),
    check('user_info', '不能为空')
      .exists()
      .custom((value, { req }) => (value ? true : false))
  ],
  _user2.default.onLogin
);
// 用户信息接口（可以用来验证登录态）
// router.get('/user', UserCtl.user)

// 从 sdk 中取出中间件
// 这里展示如何使用 Koa 中间件完成登录态的颁发与验证
// const { auth: { authorization } } = qcloud

// // --- 登录与授权 Demo --- //
// // 登录接口
// router.get('/login', authorization, controllers.login)
// // 用户信息接口（可以用来验证登录态）
// router.get('/user', validationMiddleware, controllers.user)

/**
 * 用户
 */

router.get('/user/all', _user2.default.getUserAll);
router.get('/userinfo', _user2.default.getUserInfo);
router.get('/userinfo/benison/count', _user2.default.getUserCreateAndRecieveCount);

/**
 * 祝福语
 */
router.get(
  '/benison/all',
  [
    check('catalog_id', '不能为空')
      .exists()
      .custom((value, { req }) => (value ? true : false)),
    check('user_id', '不能为空')
      .exists()
      .custom((value, { req }) => (value ? true : false))
  ],
  _benison2.default.getBenisonAll
);
router.post(
  '/benison',
  [
    check('benisons_txt', '祝福语不能为空')
      .exists()
      .custom((value, { req }) => (value ? true : false)),
    check('template_id', '不能为空')
      .exists()
      .custom((value, { req }) => (value ? true : false)),
    check('user_id', '不能为空')
      .exists()
      .custom((value, { req }) => (value ? true : false))
  ],
  _benison2.default.createBenison
);

router.put('/benison/:id', _benison2.default.update);
router.patch('/benison/:id', _benison2.default.patch);
router.put('/benison/liked/:id', _benison2.default.putLiked);
router.get('/benison/detail', _benison2.default.getBenisonDetail);
router.delete('/benison/:id', _benison2.default.delete);
/**
 * 祝福语-用户关系
 */
router.post(
  '/user/benison',
  [
    check('user_id', '不能为空')
      .exists()
      .custom((value, { req }) => (value ? true : false)),
    check('bension_id', '不能为空')
      .exists()
      .custom((value, { req }) => (value ? true : false))
  ],
  _user_benison2.default.updateUserBenisonRecords
);
/**
 * 祝福语-用户关系-喜欢度
 */
router.get(
  '/user/benison/like',
  [
    check('user_id', '不能为空')
      .exists()
      .custom((value, { req }) => (value ? true : false))
  ],
  _benison2.default.getBenisonByUserIdFromLike
);
/**
 * 模板
 */
router.get('/template', _template2.default.getTemplateAll);
router.post('/template', _template2.default.createTemplate);
router.put('/template/:id', _template2.default.update);
router.patch('/template/:id', _template2.default.update);

/**
 * 分类
 */
router.get('/catalog', _catalog2.default.getCatalogAll);
router.post('/catalog', _catalog2.default.createCatalog);

/**
 * 公共接口
 */
//文件上传接口 多文件上传
router.post('/upload', _upload.upload.array('files'), _common2.default.upload);
router.post('/text/filter', _common2.default.textFilter);
router.get('/codeurl', _common2.default.getCodeUrl);

exports.default = router;
