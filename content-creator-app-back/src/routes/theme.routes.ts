import express from 'express';
import { ThemeController } from '../controllers/theme.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validateUserType } from '../middlewares/userType.middleware';

const router = express.Router();
const themeController = new ThemeController();


/**
 * @swagger
 * /api/themes:
 *   post:
 *     summary: Create a new theme
 *     tags: [Themes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Theme'
 *     responses:
 *       201:
 *         description: The created theme
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Theme'
 */
router.post('/', authMiddleware, validateUserType(['admin']), themeController.createTheme.bind(themeController));

/**
 * @swagger
 * /api/themes/{id}:
 *   get:
 *     summary: Get a theme by id
 *     tags: [Themes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The theme id
 *     responses:
 *       200:
 *         description: The theme description by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Theme'
 *       404:
 *         description: The theme was not found
 */
router.get('/:id', authMiddleware, validateUserType(['admin']), themeController.getThemeById.bind(themeController));

/**
 * @swagger
 * /api/themes:
 *   get:
 *     summary: Get all themes
 *     tags: [Themes]
 *     responses:
 *       200:
 *         description: The list of themes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Theme'
 */
router.get('/', authMiddleware, validateUserType(['admin']), themeController.getAllThemes.bind(themeController));

/**
 * @swagger
 * /api/themes/{id}:
 *   put:
 *     summary: Update a theme
 *     tags: [Themes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The theme id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Theme'
 *     responses:
 *       200:
 *         description: The updated theme
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Theme'
 *       404:
 *         description: The theme was not found
 */
router.put('/:id', authMiddleware, validateUserType(['admin']), themeController.updateTheme.bind(themeController));

/**
 * @swagger
 * /api/themes/{id}:
 *   delete:
 *     summary: Delete a theme
 *     tags: [Themes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The theme id
 *     responses:
 *       200:
 *         description: The theme was deleted
 *       404:
 *         description: The theme was not found
 */
router.delete('/:id', authMiddleware, validateUserType(['admin']), themeController.deleteTheme.bind(themeController));

/**
 * @swagger
 * components:
 *   schemas:
 *     Theme:
 *       type: object
 *       required:
 *         - name
 *         - description
 *         - categoriesIds
 *         - coverImage
 *       properties:
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         categoriesIds:
 *           type: array
 *           items:
 *             type: string
 *         coverImage:
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

export default router;
