/*
* @Author: perry
* @Date:   2018-03-14 11:15:45
* @Last Modified by:   perry
* @Last Modified time: 2018-03-14 16:26:53
*/

   /**
   * @swagger
   * /api/catalog:
   *   get:
   *     summary: 分类列表
   *     description: 分类列表
   *     tags:
   *       - 分类列表
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: An array of puppies
   */

  /**
   * @swagger
   * /api/catalog:
   *   post:
   *     summary: 分类添加
   *     description: 分类添加
   *     tags:
   *       - 分类添加
   *     consumes:
   *       - application/x-www-form-urlencoded
   *     parameters:
   *       - name: catalog_name
   *         description: 分类名称
   *         in: formData
   *         required: true
   *         type: string
   *       - name: catalog_icon
   *         description: 分类小图标
   *         in: formData
   *         type: string
   *       - name: catalog_bg
   *         description: 分类背景图
   *         in: formData
   *         type: string
   *     responses:
   *       200:
   *         description: An array of puppies
   */