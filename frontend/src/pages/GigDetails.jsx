import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getGig } from '../store/slices/gigSlice';
import { submitBid, getBidsByGig, hireBid, reset } from '../store/slices/bidSlice';
import { toast } from 'react-toastify';
import { FaDollarSign, FaUser, FaClock } from 'react-icons/fa';

function GigDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentGig, isLoading: gigLoading } = useSelector((state) => state.gigs);
  const { bids, isLoading: bidLoading, isSuccess } = useSelector((state) => state.bids);
  const { user } = useSelector((state) => state.auth);

  const [showBidForm, setShowBidForm] = useState(false);
  const [bidData, setBidData] = useState({
    message: '',
    price: '',
  });

  const isOwner = user && currentGig && user._id === currentGig.ownerId?._id;
  const hasUserBid = user && bids.some(bid => bid.freelancerId?._id === user._id);

  useEffect(() => {
    dispatch(getGig(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (isOwner && currentGig) {
      dispatch(getBidsByGig(id));
    }
  }, [dispatch, id, isOwner, currentGig]);

  useEffect(() => {
    if (isSuccess) {
      toast.success('Action completed successfully!');
      setShowBidForm(false);
      setBidData({ message: '', price: '' });
      dispatch(reset());
      // Refresh the gig data
      dispatch(getGig(id));
      if (isOwner) {
        dispatch(getBidsByGig(id));
      }
    }
  }, [isSuccess, dispatch, id, isOwner]);

  const handleBidSubmit = (e) => {
    e.preventDefault();
    dispatch(submitBid({
      gigId: id,
      message: bidData.message,
      price: Number(bidData.price),
    }));
  };

  const handleHire = (bidId) => {
    if (window.confirm('Are you sure you want to hire this freelancer?')) {
      dispatch(hireBid(bidId));
    }
  };

  if (gigLoading || !currentGig) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Gig Details Card */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-3xl font-bold text-gray-900">{currentGig.title}</h1>
            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
              currentGig.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }`}>
              {currentGig.status === 'open' ? 'Open' : 'Assigned'}
            </span>
          </div>

          <div className="flex items-center space-x-6 mb-6 text-gray-600">
            <div className="flex items-center">
              <FaUser className="mr-2" />
              <span>Posted by <strong>{currentGig.ownerId?.name}</strong></span>
            </div>
            <div className="flex items-center">
              <FaDollarSign className="mr-1 text-green-600" />
              <span className="text-green-600 font-bold text-xl">{currentGig.budget}</span>
            </div>
            <div className="flex items-center">
              <FaClock className="mr-2" />
              <span>{new Date(currentGig.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p className="text-gray-700 whitespace-pre-line">{currentGig.description}</p>
          </div>

          {/* Action Buttons */}
          {!isOwner && currentGig.status === 'open' && !hasUserBid && (
            <button
              onClick={() => setShowBidForm(!showBidForm)}
              className="w-full bg-primary-600 text-white py-3 rounded-md hover:bg-primary-700 transition-colors font-semibold"
            >
              {showBidForm ? 'Cancel Bid' : 'Submit a Bid'}
            </button>
          )}

          {hasUserBid && (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <p className="text-blue-800 font-semibold">You have already submitted a bid for this gig.</p>
            </div>
          )}
        </div>

        {/* Bid Submission Form */}
        {showBidForm && (
          <div className="bg-white rounded-lg shadow-md p-8 mb-6">
            <h2 className="text-2xl font-bold mb-4">Submit Your Bid</h2>
            <form onSubmit={handleBidSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Proposal
                </label>
                <textarea
                  rows={4}
                  required
                  className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Explain why you're the best fit for this job..."
                  value={bidData.message}
                  onChange={(e) => setBidData({ ...bidData, message: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Price ($)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter your price"
                  value={bidData.price}
                  onChange={(e) => setBidData({ ...bidData, price: e.target.value })}
                />
              </div>
              <button
                type="submit"
                disabled={bidLoading}
                className="w-full bg-primary-600 text-white py-2 rounded-md hover:bg-primary-700 transition-colors disabled:opacity-50"
              >
                {bidLoading ? 'Submitting...' : 'Submit Bid'}
              </button>
            </form>
          </div>
        )}

        {/* Bids List (Only for Owner) */}
        {isOwner && (
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold mb-4">Received Bids ({bids.length})</h2>
            {bidLoading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              </div>
            ) : bids.length === 0 ? (
              <p className="text-gray-600 text-center py-8">No bids received yet.</p>
            ) : (
              <div className="space-y-4">
                {bids.map((bid) => (
                  <div key={bid._id} className={`border rounded-lg p-4 ${
                    bid.status === 'hired' ? 'border-green-500 bg-green-50' :
                    bid.status === 'rejected' ? 'border-red-300 bg-red-50' :
                    'border-gray-300'
                  }`}>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-lg">{bid.freelancerId?.name}</h3>
                        <p className="text-sm text-gray-600">{bid.freelancerId?.email}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-green-600 font-bold text-xl">${bid.price}</div>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          bid.status === 'hired' ? 'bg-green-200 text-green-800' :
                          bid.status === 'rejected' ? 'bg-red-200 text-red-800' :
                          'bg-yellow-200 text-yellow-800'
                        }`}>
                          {bid.status}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-3">{bid.message}</p>
                    <p className="text-xs text-gray-500">
                      Submitted on {new Date(bid.createdAt).toLocaleString()}
                    </p>
                    {currentGig.status === 'open' && bid.status === 'pending' && (
                      <button
                        onClick={() => handleHire(bid._id)}
                        disabled={bidLoading}
                        className="mt-3 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
                      >
                        Hire This Freelancer
                      </button>
                    )}
                    {bid.status === 'hired' && (
                      <div className="mt-3 text-green-700 font-semibold">
                        ✓ Freelancer Hired
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <button
          onClick={() => navigate('/dashboard')}
          className="mt-6 text-primary-600 hover:text-primary-700 font-medium"
        >
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
}

export default GigDetails;
