import express from 'express';
import { body } from 'express-validator';
import { 
  submitBid, 
  getBidsByGig, 
  hireBid,
  getMyBids
} from '../controllers/bidController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

const bidValidation = [
  body('message').trim().notEmpty().withMessage('Message is required'),
  body('price').isNumeric().withMessage('Price must be a number').custom((value) => {
    if (value < 0) {
      throw new Error('Price must be a positive number');
    }
    return true;
  })
];

router.post('/', protect, bidValidation, submitBid);
router.get('/my-bids', protect, getMyBids);
router.get('/:gigId', protect, getBidsByGig);
router.patch('/:bidId/hire', protect, hireBid);

export default router;
