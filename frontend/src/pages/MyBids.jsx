import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getMyBids } from '../store/slices/bidSlice';
import { FaDollarSign, FaClock } from 'react-icons/fa';

function MyBids() {
  const dispatch = useDispatch();
  const { myBids, isLoading } = useSelector((state) => state.bids);

  useEffect(() => {
    dispatch(getMyBids());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Bids</h1>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            <p className="mt-4 text-gray-600">Loading your bids...</p>
          </div>
        ) : myBids.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-600 text-lg mb-4">You haven't submitted any bids yet.</p>
            <Link
              to="/dashboard"
              className="inline-block bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700"
            >
              Browse Gigs
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {myBids.map((bid) => (
              <div key={bid._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <Link
                      to={`/gig/${bid.gigId?._id}`}
                      className="text-xl font-semibold text-gray-900 hover:text-primary-600"
                    >
                      {bid.gigId?.title || 'Gig Deleted'}
                    </Link>
                    <p className="text-gray-600 mt-2 mb-3">{bid.message}</p>
                    
                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      <div className="flex items-center">
                        <FaDollarSign className="mr-1 text-green-600" />
                        <span className="text-green-600 font-bold">Your Bid: ${bid.price}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-gray-600">Budget: ${bid.gigId?.budget}</span>
                      </div>
                      <div className="flex items-center">
                        <FaClock className="mr-1" />
                        <span>{new Date(bid.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="ml-4 flex flex-col items-end space-y-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      bid.status === 'hired' ? 'bg-green-100 text-green-800' :
                      bid.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {bid.status === 'hired' ? '✓ Hired' :
                       bid.status === 'rejected' ? '✗ Rejected' :
                       '⏳ Pending'}
                    </span>
                    
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      bid.gigId?.status === 'open' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      Gig: {bid.gigId?.status || 'N/A'}
                    </span>
                  </div>
                </div>

                {bid.status === 'hired' && (
                  <div className="mt-4 bg-green-50 border border-green-200 rounded-md p-4">
                    <p className="text-green-800 font-semibold">
                      🎉 Congratulations! You've been hired for this project!
                    </p>
                  </div>
                )}

                {bid.status === 'rejected' && (
                  <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-4">
                    <p className="text-red-800">
                      This bid was not selected. Keep trying on other gigs!
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyBids;
