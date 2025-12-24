import { Router } from 'express';
import * as UrlController from '../controllers/url.controller.js';

// Initialize router
const router: Router = Router();

// POST Create short URL
router.post('/shorten', UrlController.createShort);

// GET Retrieve Original URL
router.get('/shorten/:shortCode', UrlController.getUrl);

// PUT Update short url
router.put('/shorten/:shortCode', UrlController.updateUrl);

// DELETE Remove short URL
router.delete('/shorten/:shortCode', UrlController.deleteUrl);

// GET Retrieve URL Statistics
router.get('/shorten/:shortCode/stats', UrlController.getStats);

// Export router
export default router;
