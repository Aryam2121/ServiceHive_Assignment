import { validationResult } from 'express-validator';
import mongoose from 'mongoose';
import Bid from '../models/Bid.js';
import Gig from '../models/Gig.js';

// @desc    Submit a bid for a gig
// @route   POST /api/bids
// @access  Private
export const submitBid = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const { gigId, message, price } = req.body;

    // Check if gig exists
    const gig = await Gig.findById(gigId);
    if (!gig) {
      return res.status(404).json({
        success: false,
        message: 'Gig not found'
      });
    }

    // Check if gig is still open
    if (gig.status !== 'open') {
      return res.status(400).json({
        success: false,
        message: 'This gig is no longer accepting bids'
      });
    }

    // Check if user is not the owner of the gig
    if (gig.ownerId.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot bid on your own gig'
      });
    }

    // Check if user has already bid on this gig
    const existingBid = await Bid.findOne({ 
      gigId, 
      freelancerId: req.user._id 
    });

    if (existingBid) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted a bid for this gig'
      });
    }

    // Create bid
    const bid = await Bid.create({
      gigId,
      freelancerId: req.user._id,
      message,
      price
    });

    const populatedBid = await Bid.findById(bid._id)
      .populate('freelancerId', 'name email')
      .populate('gigId', 'title description budget');

    res.status(201).json({
      success: true,
      bid: populatedBid
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all bids for a specific gig
// @route   GET /api/bids/:gigId
// @access  Private (Owner only)
export const getBidsByGig = async (req, res, next) => {
  try {
    const { gigId } = req.params;

    // Check if gig exists
    const gig = await Gig.findById(gigId);
    if (!gig) {
      return res.status(404).json({
        success: false,
        message: 'Gig not found'
      });
    }

    // Check if user is the owner of the gig
    if (gig.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view bids for this gig'
      });
    }

    const bids = await Bid.find({ gigId })
      .populate('freelancerId', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bids.length,
      bids
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get my bids (for freelancer)
// @route   GET /api/bids/my-bids
// @access  Private
export const getMyBids = async (req, res, next) => {
  try {
    const bids = await Bid.find({ freelancerId: req.user._id })
      .populate('gigId', 'title description budget status')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bids.length,
      bids
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Hire a freelancer (ATOMIC OPERATION with MongoDB Transaction)
// @route   PATCH /api/bids/:bidId/hire
// @access  Private (Owner only)
export const hireBid = async (req, res, next) => {
  const session = await mongoose.startSession();
  
  try {
    await session.startTransaction();

    const { bidId } = req.params;

    // Get the bid with session
    const bid = await Bid.findById(bidId).populate('gigId').session(session);
    
    if (!bid) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        success: false,
        message: 'Bid not found'
      });
    }

    // Get the gig
    const gig = await Gig.findById(bid.gigId).session(session);
    
    if (!gig) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        success: false,
        message: 'Gig not found'
      });
    }

    // Check if user is the owner of the gig
    if (gig.ownerId.toString() !== req.user._id.toString()) {
      await session.abortTransaction();
      session.endSession();
      return res.status(403).json({
        success: false,
        message: 'Not authorized to hire for this gig'
      });
    }

    // Check if gig is still open (prevent race condition)
    if (gig.status !== 'open') {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: 'This gig has already been assigned to someone else'
      });
    }

    // ATOMIC OPERATIONS:
    // 1. Update the gig status to 'assigned'
    gig.status = 'assigned';
    gig.assignedTo = bid.freelancerId;
    await gig.save({ session });

    // 2. Update the hired bid status to 'hired'
    bid.status = 'hired';
    await bid.save({ session });

    // 3. Reject all other bids for this gig
    await Bid.updateMany(
      { 
        gigId: gig._id, 
        _id: { $ne: bidId },
        status: 'pending'
      },
      { status: 'rejected' },
      { session }
    );

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    // Populate the bid for response
    const updatedBid = await Bid.findById(bidId)
      .populate('freelancerId', 'name email')
      .populate('gigId', 'title description budget status');

    // Emit socket event for real-time notification
    if (req.io) {
      req.io.to(bid.freelancerId.toString()).emit('hired', {
        message: `You have been hired for "${gig.title}"!`,
        gigId: gig._id,
        gigTitle: gig.title,
        bidId: bid._id
      });
    }

    res.status(200).json({
      success: true,
      message: 'Freelancer hired successfully',
      bid: updatedBid
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};
