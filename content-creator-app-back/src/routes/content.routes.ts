import express from 'express';
import { ContentController } from '../controllers/content.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = express.Router();
const contentController = new ContentController();

/**
 * @swagger
 * components:
 *   schemas:
 *     Content:
 *       type: object
 *       required:
 *         - title
 *         - themesIds
 *         - values
 *         - userId
 *       properties:
 *         title:
 *           type: string
 *         themesIds:
 *           type: array
 *           items:
 *             type: string
 *         values:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               categoryId:
 *                 type: string
 *               value:
 *                 type: string
 *         userId:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         deletedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/contents:
 *   post:
 *     summary: Create a new content
 *     tags: [Contents]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Content'
 *     responses:
 *       201:
 *         description: The created content
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Content'
 */
router.post('/', authMiddleware, contentController.createContent.bind(contentController));

/**
 * @swagger
 * /api/contents/{id}:
 *   get:
 *     summary: Get a content by id
 *     tags: [Contents]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The content id
 *     responses:
 *       200:
 *         description: The content description by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Content'
 *       404:
 *         description: The content was not found
 */
router.get('/:id', contentController.getContentById.bind(contentController));

/**
 * @swagger
 * /api/contents:
 *   get:
 *     summary: Get all contents
 *     tags: [Contents]
 *     responses:
 *       200:
 *         description: The list of contents
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Content'
 */
router.get('/', contentController.getAllContents.bind(contentController));

/**
 * @swagger
 * /api/contents/{id}:
 *   put:
 *     summary: Update a content
 *     tags: [Contents]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The content id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Content'
 *     responses:
 *       200:
 *         description: The updated content
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Content'
 *       404:
 *         description: The content was not found
 */
router.put('/:id', authMiddleware, contentController.updateContent.bind(contentController));

/**
 * @swagger
 * /api/contents/{id}:
 *   delete:
 *     summary: Delete a content
 *     tags: [Contents]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The content id
 *     responses:
 *       200:
 *         description: The content was deleted
 *       404:
 *         description: The content was not found
 */
router.delete('/:id', authMiddleware, contentController.deleteContent.bind(contentController));

export default router;
