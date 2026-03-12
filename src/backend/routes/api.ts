import { Router } from 'express';
import { suggestHandler } from '../controllers/suggestController';
import { weatherHandler } from '../controllers/weatherController';
import { forecastHandler } from '../controllers/forecastController';
import { validateSuggestion } from '../middlewares/validateSuggestion';

const router = Router();

router.get('/suggest', suggestHandler);
router.get('/weather', validateSuggestion, weatherHandler);
router.get('/forecast', validateSuggestion, forecastHandler);

export default router;
