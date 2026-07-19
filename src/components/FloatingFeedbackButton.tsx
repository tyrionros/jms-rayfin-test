import { useState } from 'react';
import { FeedbackModal } from './FeedbackModal';
import { type AuthUser } from '@/services/IAuthService';

interface FloatingFeedbackButtonProps {
  user?: AuthUser | null;
  currentPageName?: string;
}

export function FloatingFeedbackButton({ user, currentPageName = 'Hemy 360 - test by JMS' }: FloatingFeedbackButtonProps) {
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  return (
    <>
      {/* Floating Feedback Button */}
      <button
        onClick={() => setIsFeedbackOpen(true)}
        className="fixed bottom-8 right-8 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-[#7C4D2F] text-[#FAF8F2] shadow-lg transition-all duration-200 hover:bg-[#9B6240] hover:shadow-xl active:scale-95"
        title="Send feedback"
        aria-label="Send feedback"
      >
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
          />
        </svg>
      </button>

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
        userEmail={user?.email}
        currentPageName={currentPageName}
      />
    </>
  );
}
