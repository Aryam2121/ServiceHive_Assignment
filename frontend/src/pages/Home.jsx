import React from 'react';
import { Link } from 'react-router-dom';
import { FaBriefcase, FaUsers, FaRocket } from 'react-icons/fa';

function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">
              Welcome to GigFlow
            </h1>
            <p className="text-xl mb-8 text-primary-100">
              The modern freelance marketplace where clients and freelancers connect
            </p>
            <div className="space-x-4">
              <Link
                to="/register"
                className="bg-white text-primary-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 inline-block"
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="bg-primary-700 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-primary-800 inline-block"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaBriefcase className="text-primary-600 text-2xl" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Post Your Gig</h3>
            <p className="text-gray-600">
              Create a job posting with your requirements and budget
            </p>
          </div>
          <div className="text-center p-6">
            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaUsers className="text-primary-600 text-2xl" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Receive Bids</h3>
            <p className="text-gray-600">
              Talented freelancers will submit their proposals
            </p>
          </div>
          <div className="text-center p-6">
            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaRocket className="text-primary-600 text-2xl" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Hire & Start</h3>
            <p className="text-gray-600">
              Choose the best freelancer and start working together
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of clients and freelancers today
          </p>
          <Link
            to="/register"
            className="bg-primary-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-primary-700 inline-block"
          >
            Create Free Account
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
