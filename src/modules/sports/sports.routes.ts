import { Router } from 'express';
import { SportsController } from './sports.controller';
import { authenticate, authorizeRoles } from '../../middlewares/auth.middleware';

const router = Router();
const sportsController = new SportsController();

router.get('/', sportsController.getAllSports);
router.get('/:id', sportsController.getSportById);

// Admin only routes
router.use(authenticate, authorizeRoles('ADMIN'));
router.post('/', sportsController.createSport);
router.patch('/:id', sportsController.updateSport);
router.delete('/:id', sportsController.deleteSport);

export default router;
