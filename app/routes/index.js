/*
* @Author: perry
* @Date:   2018-03-14 10:27:32
* @Last Modified by:   perry
* @Last Modified time: 2018-03-16 11:07:22
*/
import express from 'express';
import UserCtl from '../controllers/user.ctr';
import BenisonCtl from '../controllers/benison.ctr';
import TemplateCtl from '../controllers/template.ctr';
import catalogCtl from '../controllers/catalog.ctr';
const { check, validationResult } = require('express-validator/check');


// const { auth: { authorizationMiddleware, validationMiddleware } } = require('../qcloud')

const router = express.Router();


// --- 登录与授权 Demo --- //
// 登录接口
router.get('/login', UserCtl.onLogin)
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

 

router.get('/user/all', UserCtl.getUserAll)
router.get('/benison/all', BenisonCtl.getBenisonAll)

router.post('/benison', [
	check('template_id', '不能为空').exists().custom((value, { req }) => value ? true :false),
	check('user_id', '不能为空').exists().custom((value, { req }) => value ? true :false)
	], BenisonCtl.createBenison)

router.get('/benison/detail', BenisonCtl.getBenisonDetail)

router.get('/template', TemplateCtl.getTemplateAll)
router.post('/template', TemplateCtl.createTemplate)


router.get('/catalog', catalogCtl.getCatalogAll)
// router.get('/bycatalog', catalogCtl.getBenisonAll)
router.post('/catalog', catalogCtl.createCatalog)


export default router;