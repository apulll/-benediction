/*
* @Author: perry
* @Date:   2018-03-14 10:27:32
* @Last Modified by:   perry
* @Last Modified time: 2018-03-14 18:15:33
*/
import express from 'express';
import UserCtl from '../controllers/user.ctr';
import BenisonCtl from '../controllers/benison.ctr';
import TemplateCtl from '../controllers/template.ctr';
import catalogCtl from '../controllers/catalog.ctr';

const router = express.Router();


router.get('/user/all', UserCtl.getUserAll)
router.get('/benison/all', BenisonCtl.getBenisonAll)

router.post('/benison', BenisonCtl.createBenison)

router.get('/template', TemplateCtl.getTemplateAll)
router.post('/template', TemplateCtl.createTemplate)


router.get('/catalog', catalogCtl.getCatalogAll)
router.get('/bycatalog', catalogCtl.getBenisonAll)
router.post('/catalog', catalogCtl.createCatalog)


export default router;