import { validationResult } from 'express-validator';
import Gig from '../models/Gig.js';

// @desc    Get all gigs with search and filter
// @route   GET /api/gigs
// @access  Public
export const getGigs = async (req, res, next) => {
  console.log('=== GET GIGS REQUEST ===');
  try {
    const { search, status } = req.query;
    console.log('Query params:', { search, status });
    
    let query = {};

    // Search by title
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by status (optional)
    if (status) {
      query.status = status;
    }

    console.log('MongoDB query:', query);

    const gigs = await Gig.find(query)
      .populate('ownerId', 'name email')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });

    console.log('Found gigs:', gigs.length);

    res.status(200).json({
      success: true,
      count: gigs.length,
      gigs
    });
  } catch (error) {
    console.error('ERROR fetching gigs:', error);
    next(error);
  }
};

// @desc    Get single gig by ID
// @route   GET /api/gigs/:id
// @access  Public
export const getGigById = async (req, res, next) => {
  try {
    const gig = await Gig.findById(req.params.id)
      .populate('ownerId', 'name email')
      .populate('assignedTo', 'name email');

    if (!gig) {
      return res.status(404).json({
        success: false,
        message: 'Gig not found'
      });
    }

    res.status(200).json({
      success: true,
      gig
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new gig
// @route   POST /api/gigs
// @access  Private
export const createGig = async (req, res, next) => {
  console.log('=== CREATE GIG REQUEST RECEIVED ===');
  console.log('User:', req.user?._id);
  console.log('Body:', req.body);
  
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const { title, description, budget } = req.body;

    console.log('Creating gig:', { title, description, budget, ownerId: req.user._id });

    const gig = await Gig.create({
      title,
      description,
      budget,
      ownerId: req.user._id
    });

    console.log('Gig created successfully! ID:', gig._id);

    const populatedGig = await Gig.findById(gig._id).populate('ownerId', 'name email');

    console.log('Populated gig:', populatedGig);

    res.status(201).json({
      success: true,
      gig: populatedGig
    });
  } catch (error) {
    console.error('ERROR creating gig:', error);
    next(error);
  }
};

// @desc    Update gig
// @route   PUT /api/gigs/:id
// @access  Private (Owner only)
export const updateGig = async (req, res, next) => {
  try {
    let gig = await Gig.findById(req.params.id);

    if (!gig) {
      return res.status(404).json({
        success: false,
        message: 'Gig not found'
      });
    }

    // Check if user is the owner
    if (gig.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this gig'
      });
    }

    const { title, description, budget } = req.body;

    gig = await Gig.findByIdAndUpdate(
      req.params.id,
      { title, description, budget },
      { new: true, runValidators: true }
    ).populate('ownerId', 'name email');

    res.status(200).json({
      success: true,
      gig
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete gig
// @route   DELETE /api/gigs/:id
// @access  Private (Owner only)
export const deleteGig = async (req, res, next) => {
  try {
    const gig = await Gig.findById(req.params.id);

    if (!gig) {
      return res.status(404).json({
        success: false,
        message: 'Gig not found'
      });
    }

    // Check if user is the owner
    if (gig.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this gig'
      });
    }

    await gig.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Gig deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
