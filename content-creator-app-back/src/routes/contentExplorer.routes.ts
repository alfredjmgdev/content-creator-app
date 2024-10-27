import { Router } from 'express';
import { ContentExplorerController } from '../controllers/contentExplorer.controller';

const router = Router();
const contentExplorerController = new ContentExplorerController();

router.get('/', contentExplorerController.getAllData);

export default router;
