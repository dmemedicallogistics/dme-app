import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { AlertCircle, Loader2, ArrowLeft } from 'lucide-react';
import Header from './Header';

export default function DocumentViewer() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [_documentUrl, _setDocumentUrl] = useState<string | null>(null);

  useEffect(() => {
    loadDocument();
  }, []);

  const loadDocument = async () => {
    try {
      setLoading(true);

      // Check admin authentication
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('Authentication required');
      }

      const { data: profile } = await supabase
        .from('user_profiles')
        .select('is_admin')
        .eq('id', user.id)
        .maybeSingle();

      if (!profile || !profile.is_admin) {
        throw new Error('Admin access required');
      }

      // Parse URL parameters
      const params = new URLSearchParams(window.location.search);
      const referralId = params.get('referralId');
      const docType = params.get('type');

      if (!referralId || !docType) {
        throw new Error('Missing required parameters');
      }

      // Fetch referral to get document path
      const { data: referral, error: fetchError } = await supabase
        .from('referrals')
        .select('prescription_url, chart_notes_url, insurance_url')
        .eq('id', referralId)
        .maybeSingle();

      if (fetchError) throw fetchError;
      if (!referral) throw new Error('Referral not found');

      // Get the appropriate document path
      let documentPath: string | null = null;
      if (docType === 'prescription') documentPath = referral.prescription_url;
      else if (docType === 'chart_notes') documentPath = referral.chart_notes_url;
      else if (docType === 'insurance') documentPath = referral.insurance_url;

      if (!documentPath) {
        throw new Error('Document not found');
      }

      // Normalize the path
      const relativePath = normalizeStoragePath(documentPath);

      // Generate signed URL
      const { data: signedData, error: signedError } = await supabase
        .storage
        .from('referral-documents')
        .createSignedUrl(relativePath, 3600);

      if (signedError) throw signedError;
      if (!signedData?.signedUrl) throw new Error('Failed to generate document URL');

      // Navigate to the signed URL in the same tab
      window.location.replace(signedData.signedUrl);
    } catch (err) {
      console.error('Failed to load document:', err);
      setError(err instanceof Error ? err.message : 'Failed to load document');
      setLoading(false);
    }
  };

  const normalizeStoragePath = (pathOrUrl: string): string => {
    if (pathOrUrl.includes('supabase.co/storage/v1/object/public/referral-documents/')) {
      const parts = pathOrUrl.split('referral-documents/');
      return parts[1];
    }
    return pathOrUrl;
  };

  const handleBack = () => {
    window.history.back();
  };

  if (loading) {
    return (
      <>
        <Header isAuthenticated={true} />
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex items-center justify-center pt-20">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-slate-600">Loading document...</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header isAuthenticated={true} />
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex items-center justify-center pt-20 px-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-8">
            <div className="flex items-start gap-3 text-red-600 mb-6">
              <AlertCircle className="h-6 w-6 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-lg">Error Loading Document</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
            <button
              onClick={handleBack}
              className="w-full bg-slate-600 hover:bg-slate-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </button>
          </div>
        </div>
      </>
    );
  }

  return null;
}
