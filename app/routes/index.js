/*
* @Author: perry
* @Date:   2018-03-14 10:27:32
* @Last Modified by:   perry
* @Last Modified time: 2018-04-06 12:47:53
*/
import express from 'express';
import UserCtl from '../controllers/user.ctr';
import BenisonCtl from '../controllers/benison.ctr';
import TemplateCtl from '../controllers/template.ctr';
import catalogCtl from '../controllers/catalog.ctr';
import commonCtl from '../controllers/common.ctr';
import userBenisonCtl from '../controllers/user_benison.ctr';
const { check, validationResult } = require('express-validator/check');
import { upload } from '../lib/upload';

// const { auth: { authorizationMiddleware, validationMiddleware } } = require('../qcloud')

const router = express.Router();

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
  UserCtl.onLogin
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

router.get('/user/all', UserCtl.getUserAll);
router.get('/userinfo', UserCtl.getUserInfo);
router.get('/userinfo/benison/count', UserCtl.getUserCreateAndRecieveCount);

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
  BenisonCtl.getBenisonAll
);
router.post(
  '/benison',
  [
    check('template_id', '不能为空')
      .exists()
      .custom((value, { req }) => (value ? true : false)),
    check('user_id', '不能为空')
      .exists()
      .custom((value, { req }) => (value ? true : false))
  ],
  BenisonCtl.createBenison
);

router.put('/benison/:id', BenisonCtl.update);
router.patch('/benison/:id', BenisonCtl.patch);
router.put('/benison/liked/:id', BenisonCtl.putLiked);
router.get('/benison/detail', BenisonCtl.getBenisonDetail);
router.delete('/benison/:id', BenisonCtl.delete);
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
  userBenisonCtl.updateUserBenisonRecords
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
  BenisonCtl.getBenisonByUserIdFromLike
);
/**
 * 模板
 */
router.get('/template', TemplateCtl.getTemplateAll);
router.post('/template', TemplateCtl.createTemplate);
router.put('/template/:id', TemplateCtl.update);
router.patch('/template/:id', TemplateCtl.update);

/**
 * 分类
 */
router.get('/catalog', catalogCtl.getCatalogAll);
router.post('/catalog', catalogCtl.createCatalog);

/**
 * 公共接口
 */
//文件上传接口 多文件上传
router.post('/upload', upload.array('files'), commonCtl.upload);
router.post('/text/filter', commonCtl.textFilter);
router.get('/codeurl', commonCtl.getCodeUrl);

export default router;
