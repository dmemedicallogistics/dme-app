import { useState, useEffect } from 'react';
import { MessageSquare, Send, User, Shield } from 'lucide-react';
import { supabase } from './lib/supabase';

interface Comment {
  id: string;
  referral_id: string;
  author_type: 'client' | 'admin';
  author_name: string;
  comment_text: string;
  created_at: string;
}

interface CommentsSectionProps {
  referralId: string;
  isAdmin: boolean;
}

export default function CommentsSection({ referralId, isAdmin }: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [authorName, setAuthorName] = useState('');

  useEffect(() => {
    loadComments();
    loadAuthorName();
  }, [referralId]);

  const loadAuthorName = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('user_profiles')
        .select('contact_name, is_admin')
        .eq('id', user.id)
        .maybeSingle();

      if (profile) {
        setAuthorName(profile.contact_name);
      }
    } catch (err) {
      console.error('Error loading author name:', err);
    }
  };

  const loadComments = async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('referral_comments')
        .select('*')
        .eq('referral_id', referralId)
        .order('created_at', { ascending: true });

      if (fetchError) {
        console.error('Error loading comments:', fetchError);
        setError('Failed to load comments');
        return;
      }

      setComments(data || []);
    } catch (err) {
      console.error('Error loading comments:', err);
      setError('Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newComment.trim()) return;

    setSubmitting(true);
    setError('');

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setError('You must be logged in to comment');
        setSubmitting(false);
        return;
      }

      const { data: profile } = await supabase
        .from('user_profiles')
        .select('id, contact_name, is_admin')
        .eq('id', user.id)
        .maybeSingle();

      if (!profile) {
        setError('User profile not found');
        setSubmitting(false);
        return;
      }

      const { error: insertError } = await supabase
        .from('referral_comments')
        .insert({
          referral_id: referralId,
          author_type: profile.is_admin ? 'admin' : 'client',
          author_name: profile.contact_name,
          profile_id: profile.id,
          comment_text: newComment.trim(),
        });

      if (insertError) {
        console.error('Error submitting comment:', insertError);
        setError('Failed to submit comment');
        return;
      }

      setNewComment('');
      await loadComments();

      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-comment-notification`;
      const headers = {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      };

      fetch(apiUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          referralId,
          authorType: profile.is_admin ? 'admin' : 'client',
        }),
      }).catch(err => {
        console.error('Failed to send notification:', err);
      });

    } catch (err) {
      console.error('Error submitting comment:', err);
      setError('Failed to submit comment');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
      <div className="flex items-center gap-3 mb-6">
        <MessageSquare className="h-6 w-6 text-red-600" />
        <h2 className="text-2xl font-bold text-gray-900">Comments</h2>
      </div>

      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading comments...</div>
      ) : (
        <>
          {comments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No comments yet. Be the first to add one!
            </div>
          ) : (
            <div className="space-y-4 mb-6">
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className={`p-4 rounded-lg border ${
                    comment.author_type === 'admin'
                      ? 'bg-blue-50 border-blue-200'
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`flex-shrink-0 rounded-full p-2 ${
                        comment.author_type === 'admin'
                          ? 'bg-blue-100'
                          : 'bg-gray-100'
                      }`}
                    >
                      {comment.author_type === 'admin' ? (
                        <Shield className="h-4 w-4 text-blue-600" />
                      ) : (
                        <User className="h-4 w-4 text-gray-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-900">
                          {comment.author_name}
                        </span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            comment.author_type === 'admin'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-gray-200 text-gray-700'
                          }`}
                        >
                          {comment.author_type === 'admin' ? 'Admin' : 'Client'}
                        </span>
                        <span className="text-sm text-gray-500">
                          {formatDate(comment.created_at)}
                        </span>
                      </div>
                      <p className="text-gray-700 whitespace-pre-wrap">
                        {comment.comment_text}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <form onSubmit={handleSubmitComment} className="border-t pt-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Add a comment
            </label>
            {error && (
              <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {error}
              </div>
            )}
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Type your message here..."
              rows={3}
              disabled={submitting}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            <div className="flex justify-end mt-3">
              <button
                type="submit"
                disabled={submitting || !newComment.trim()}
                className="bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {submitting ? (
                  'Sending...'
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Send Comment
                  </>
                )}
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}
