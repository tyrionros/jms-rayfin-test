import { useState } from 'react';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (feedback: { rating: number; message: string }) => void;
}

export function FeedbackModal({ isOpen, onClose, onSubmit }: FeedbackModalProps) {
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState('');
  const [hoveredStar, setHoveredStar] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }
    setIsSubmitting(true);
    try {
      await onSubmit({ rating, message });
      setRating(0);
      setMessage('');
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        {/* ── Header ── */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#1B2A4A]">Share Your Feedback</h2>
          <button
            onClick={onClose}
            className="text-[#C4956A] transition-colors hover:text-[#1B2A4A]"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* ── Star Rating ── */}
        <div className="mb-6">
          <p className="mb-3 text-sm font-medium text-[#1B2A4A]">How would you rate us?</p>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onMouseEnter={() => setHoveredStar(star)}
                onMouseLeave={() => setHoveredStar(0)}
                onClick={() => setRating(star)}
                className="transition-transform hover:scale-110"
              >
                <svg
                  className={`h-8 w-8 ${
                    star <= (hoveredStar || rating)
                      ? 'fill-[#7C4D2F] text-[#7C4D2F]'
                      : 'text-[#DDD4C0]'
                  }`}
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </button>
            ))}
          </div>
        </div>

        {/* ── Message Input ── */}
        <div className="mb-6">
          <label className="mb-2 block text-sm font-medium text-[#1B2A4A]">
            Tell us more (optional)
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="What can we improve?"
            className="w-full rounded-lg border border-[#DDD4C0] bg-[#FAF8F2] px-4 py-3 text-sm text-[#1B2A4A] placeholder-[#C4956A] transition-colors focus:border-[#1B2A4A] focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]/20"
            rows={4}
          />
        </div>

        {/* ── Actions ── */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 rounded-lg border border-[#DDD4C0] bg-[#FAF8F2] px-4 py-2.5 text-sm font-semibold text-[#1B2A4A] transition-colors hover:bg-[#F0EAD8] disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 rounded-lg bg-[#1B2A4A] px-4 py-2.5 text-sm font-semibold text-[#FAF8F2] transition-colors hover:bg-[#243B5E] disabled:opacity-50"
          >
            {isSubmitting ? 'Sending...' : 'Submit'}
          </button>
        </div>
      </div>
    </div>
  );
}
