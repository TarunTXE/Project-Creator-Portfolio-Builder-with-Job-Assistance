import { useState, useEffect } from 'react';
import * as api from '../services/api';

const FeedbackSection = ({ portfolioId }) => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form state
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchFeedbacks();
  }, [portfolioId]);

  const fetchFeedbacks = async () => {
    try {
      const { data } = await api.getFeedback(portfolioId);
      setFeedbacks(data);
    } catch (err) {
      setError('Failed to load feedback.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setSubmitting(true);
    setSubmitError(null);
    setSuccess(false);

    try {
      await api.submitFeedback(portfolioId, { name, comment, rating });
      setSuccess(true);
      setName('');
      setComment('');
      setRating(5);
      fetchFeedbacks(); // refresh list
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'Failed to submit feedback.');
    } finally {
      setSubmitting(false);
    }
  };

  const avgRating = feedbacks.length
    ? (feedbacks.reduce((acc, curr) => acc + curr.rating, 0) / feedbacks.length).toFixed(1)
    : 0;

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="border-t border-gray-800 pt-6">
        <h3 className="text-2xl font-semibold text-white mb-6">Feedback & Ratings</h3>
      </div>

      {/* Rating Summary Card */}
      <div className="bg-[#111827] rounded-2xl shadow-lg border border-gray-800 p-6 flex items-center gap-4">
        <div className="text-4xl font-bold text-indigo-400">{avgRating}</div>
        <div>
          <div className="flex text-yellow-500 text-lg">
            {'★'.repeat(Math.round(avgRating)) + '☆'.repeat(5 - Math.round(avgRating))}
          </div>
          <div className="text-gray-400 text-sm">{feedbacks.length} reviews</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Form Card */}
        <div className="md:col-span-1">
          <div className="bg-[#111827] p-6 rounded-2xl shadow-lg border border-gray-800">
            <h4 className="text-lg font-medium text-white mb-4">Leave a Review</h4>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Rating</label>
                <div className="flex gap-1 text-2xl">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      className={star <= rating ? 'text-yellow-500' : 'text-gray-700'}
                      onClick={() => setRating(star)}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Name (Optional)</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-gray-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition-all text-white bg-[#1f2937] placeholder-gray-500"
                  placeholder="Anonymous"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Comment</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  required
                  rows="3"
                  className="w-full border border-gray-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition-all text-white bg-[#1f2937] placeholder-gray-500"
                  placeholder="What did you think of this portfolio?"
                ></textarea>
              </div>

              {submitError && <p className="text-red-500 text-sm">{submitError}</p>}
              {success && <p className="text-green-600 text-sm font-medium">Feedback submitted!</p>}

              <button
                type="submit"
                disabled={submitting || !comment.trim()}
                className="w-full py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-all duration-200 shadow-sm disabled:opacity-50 disabled:bg-[#1f2937]"
              >
                {submitting ? 'Submitting...' : 'Submit Feedback'}
              </button>
            </form>
          </div>
        </div>

        {/* Feedback List */}
        <div className="md:col-span-2 space-y-4">
          {loading ? (
            <p className="text-gray-400">Loading feedback...</p>
          ) : feedbacks.length === 0 ? (
            <p className="text-gray-400 italic bg-[#111827] p-6 rounded-2xl shadow-lg border border-gray-800">No feedback yet. Be the first to leave a review!</p>
          ) : (
            feedbacks.map((fb) => (
              <div key={fb._id} className="bg-[#111827] p-6 rounded-2xl shadow-sm border border-gray-800 hover:shadow-lg transition-all duration-200">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h5 className="font-semibold text-white">{fb.name}</h5>
                    <div className="flex text-yellow-500 text-sm">
                      {'★'.repeat(fb.rating) + '☆'.repeat(5 - fb.rating)}
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(fb.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="border-t border-gray-800 my-3"></div>
                <p className="text-gray-400 text-sm">{fb.comment}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default FeedbackSection;
