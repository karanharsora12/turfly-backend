import { Router } from 'express';
import { VenuesController } from './venues.controller';
import { authenticate, authorizeRoles } from '../../middlewares/auth.middleware';

const router = Router();
const venuesController = new VenuesController();

router.get('/', venuesController.searchVenues);
router.get('/:id', venuesController.getVenueById);

// Admin only routes
router.use(authenticate, authorizeRoles('ADMIN'));
router.post('/', venuesController.createVenue);
router.patch('/:id', venuesController.updateVenue);
router.delete('/:id', venuesController.deleteVenue);

export default router;
