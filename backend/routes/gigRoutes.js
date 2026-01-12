import express from 'express';
import { body } from 'express-validator';
import { 
  getGigs, 
  getGigById, 
  createGig, 
  updateGig, 
  deleteGig 
} from '../controllers/gigController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

const gigValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('budget').isNumeric().withMessage('Budget must be a number').custom((value) => {
    if (value < 0) {
      throw new Error('Budget must be a positive number');
    }
    return true;
  })
];

router.get('/', getGigs);
router.get('/:id', getGigById);
router.post('/', protect, gigValidation, createGig);
router.put('/:id', protect, updateGig);
router.delete('/:id', protect, deleteGig);

export default router;
