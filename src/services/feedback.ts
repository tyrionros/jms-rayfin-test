import { getRayfinClient } from '@/services/rayfinClient';

export interface FeedbackData {
  userEmail: string;
  rating: number;
  subject: string;
  message: string;
}

export async function submitFeedback(data: FeedbackData): Promise<string> {
  const client = getRayfinClient();
  const session = client.auth.getSession();

  if (!session.isAuthenticated || !session.user) {
    throw new Error('Cannot submit feedback: user is not authenticated.');
  }

  const feedback = await client.data.Feedback.create({
    user_id: session.user.id,
    user_email: data.userEmail,
    subject: data.subject,
    message: data.message,
    rating: data.rating,
    createdAt: new Date(),
  });

  return (feedback as { id: string }).id;
}
